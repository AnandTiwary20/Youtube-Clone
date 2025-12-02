const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Video = require('../models/Video');
const Channel = require('../models/Channel');

// @route   POST api/videos
// @desc    Upload a video
// @access  Private
router.post(
  '/',
  [
    auth.authenticate,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('url', 'Video URL is required').not().isEmpty(),
      check('thumbnail', 'Thumbnail is required').not().isEmpty(),
      check('duration', 'Duration is required').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get channel of the current user
      const channel = await Channel.findOne({ owner: req.user.id });
      if (!channel) {
        return res.status(400).json({ message: 'You need to create a channel first' });
      }

      const {
        title,
        description,
        url,
        thumbnail,
        duration,
        tags = [],
        visibility = 'public',
        category = 'Entertainment'
      } = req.body;

      // Create new video
      const video = new Video({
        title,
        description,
        url,
        thumbnail,
        duration,
        tags,
        visibility,
        category,
        channel: channel._id
      });

      await video.save();

      // Add video to channel's videos array
      await Channel.findByIdAndUpdate(channel._id, {
        $push: { videos: video._id }
      });

      res.status(201).json(video);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/videos
// @desc    Get all public videos with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('channel', ['name', 'avatar']);

    const total = await Video.countDocuments({ visibility: 'public' });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/videos/:id
// @desc    Get video by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channel')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username profilePicture'
        }
      });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/videos/like/:id
// @desc    Like or unlike a video
// @access  Private
router.put('/like/:id', auth.authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the video has already been liked
    const likeIndex = video.likes.indexOf(req.user.id);
    const dislikeIndex = video.dislikes.indexOf(req.user.id);

    if (likeIndex === -1) {
      // Add like
      video.likes.unshift(req.user.id);
      
      // Remove from dislikes if present
      if (dislikeIndex !== -1) {
        video.dislikes.splice(dislikeIndex, 1);
      }
      
      await video.save();
      return res.json({ message: 'Video liked' });
    } else {
      // Remove like
      video.likes.splice(likeIndex, 1);
      await video.save();
      return res.json({ message: 'Like removed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/videos/dislike/:id
// @desc    Dislike or undislike a video
// @access  Private
router.put('/dislike/:id', auth.authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the video has already been disliked
    const dislikeIndex = video.dislikes.indexOf(req.user.id);
    const likeIndex = video.likes.indexOf(req.user.id);

    if (dislikeIndex === -1) {
      // Add dislike
      video.dislikes.unshift(req.user.id);
      
      // Remove from likes if present
      if (likeIndex !== -1) {
        video.likes.splice(likeIndex, 1);
      }
      
      await video.save();
      return res.json({ message: 'Video disliked' });
    } else {
      // Remove dislike
      video.dislikes.splice(dislikeIndex, 1);
      await video.save();
      return res.json({ message: 'Dislike removed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/videos/channel/:channelId
// @desc    Get all videos by channel
// @access  Public
router.get('/channel/:channelId', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const videos = await Video.find({ channel: channel._id, visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('channel', ['name', 'avatar']);

    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/videos/search?q=query
// @desc    Search videos
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find(
      { $text: { $search: query }, visibility: 'public' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .populate('channel', ['name', 'avatar']);

    const total = await Video.countDocuments({ 
      $text: { $search: query }, 
      visibility: 'public' 
    });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
