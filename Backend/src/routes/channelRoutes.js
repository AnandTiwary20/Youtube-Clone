import express from 'express';
import { check, validationResult } from 'express-validator';
import { authenticate, isAdmin, isOwner } from '../middleware/auth.js';
import Channel from '../models/Channel.js';
import User from '../models/User.js';

const router = express.Router();

router.post(
  '/',
  [
    authenticate,
    [
      check('name', 'Channel name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, avatar, banner } = req.body;

    try {
      // Check if channel already exists for the user
      let channel = await Channel.findOne({ owner: req.user.userId });

      if (channel) {
        // Update existing channel
        channel = await Channel.findByIdAndUpdate(
          channel._id,
          { $set: { name, description, avatar, banner } },
          { new: true }
        );
        return res.json(channel);
      }

      // Create new channel
      channel = new Channel({
        name,
        description,
        owner: req.user.userId,
        avatar: avatar || '',
        banner: banner || ''
      });

      await channel.save();
      res.json(channel);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


router.get('/me', authenticate, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user.userId })
      .populate('owner', ['username', 'profilePicture'])
      .populate('videos');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', ['username', 'profilePicture'])
      .populate('videos');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Channel not found' });
    }
    res.status(500).send('Server Error');
  }
});


router.put('/subscribe/:channelId', authenticate, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if the user is the channel owner
    if (channel.owner.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot subscribe to your own channel' });
    }

    const user = await User.findById(req.user.userId);
    const isSubscribed = user.subscribedChannels.includes(channel._id);

    if (isSubscribed) {
      // Unsubscribe
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { subscribedChannels: channel._id }
      });
      await Channel.findByIdAndUpdate(channel._id, {
        $pull: { subscribers: req.user.userId }
      });
      res.json({ message: 'Unsubscribed successfully' });
    } else {
      // Subscribe
      await User.findByIdAndUpdate(req.user.userId, {
        $addToSet: { subscribedChannels: channel._id }
      });
      await Channel.findByIdAndUpdate(channel._id, {
        $addToSet: { subscribers: req.user.userId }
      });
      res.json({ message: 'Subscribed successfully' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/channels/search?q=query
// @desc    Search channels
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const channels = await Channel.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('owner', ['username', 'profilePicture']);

    res.json(channels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
