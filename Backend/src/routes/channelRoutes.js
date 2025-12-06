import express from 'express';
import { check, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Channel from '../models/Channel.js';
import User from '../models/User.js';

const router = express.Router();

// Create OR Update Channel
router.post(
  '/',
  [
    authenticate,
    [
      check('channelName', 'Channel name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { channelName, description, avatar, channelBanner } = req.body;

    try {
      let channel = await Channel.findOne({ owner: req.user._id });

      // Update if exists
      if (channel) {
        channel = await Channel.findByIdAndUpdate(
          channel._id,
          { $set: { channelName, description, avatar, channelBanner } },
          { new: true }
        );
        return res.json(channel);
      }

      // Create new channel
      const newChannel = new Channel({
        channelName,
        description,
        owner: req.user._id,
        avatar: avatar || '',
        channelBanner: channelBanner || ''
      });

      await newChannel.save();
      res.status(201).json(newChannel);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Get my channel
router.get('/me', authenticate, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id })
      .populate('owner', ['username', 'avatar'])
      .populate('videos');

    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    res.json(channel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get channel by ID
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', ['username', 'avatar'])
      .populate('videos');

    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    res.json(channel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Subscribe / Unsubscribe
router.put('/subscribe/:channelId', authenticate, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    if (channel.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot subscribe to your own channel' });
    }

    const user = await User.findById(req.user._id);
    const isSubscribed = user.subscribedChannels.includes(channel._id);

    if (isSubscribed) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { subscribedChannels: channel._id } });
      await Channel.findByIdAndUpdate(channel._id, { $pull: { subscribers: req.user._id } });
      return res.json({ message: 'Unsubscribed successfully' });
    }

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { subscribedChannels: channel._id } });
    await Channel.findByIdAndUpdate(channel._id, { $addToSet: { subscribers: req.user._id } });

    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Channel Search
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const channels = await Channel.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('owner', ['username', 'avatar']);

    res.json(channels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
