import express from 'express';
import { check, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

const router = express.Router();

router.post(
  "/upload",
  [
    authenticate,
    check("title", "Title is required").not().isEmpty(),
    check("videoUrl", "Video URL is required").not().isEmpty(),
    check("thumbnailUrl", "Thumbnail URL is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const channel = await Channel.findOne({ owner: req.user._id });
      if (!channel) return res.status(400).json({ message: "Create a channel first" });

      const { title, description, videoUrl, thumbnailUrl, duration, tags = [], visibility = "public", category = "Entertainment" } = req.body;

      const video = await Video.create({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
        tags,
        visibility,
        category,
        uploader: req.user._id,
        channel: channel._id
      });

      channel.videos.push(video._id);
      await channel.save();

      res.status(201).json({ message: "Video uploaded successfully", video });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);


// Get all videos
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('channel', ['channelName', 'avatar']);

    const total = await Video.countDocuments({ visibility: 'public' });

    res.json({ videos, currentPage: page, totalPages: Math.ceil(total / limit), totalVideos: total });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Filter videos by category
router.get('/category/:type', async (req, res) => {
  try {
    const videos = await Video.find({ category: req.params.type, visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('channel', ['channelName', 'avatar']);

    res.json(videos);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Single video page
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channel', ['channelName', 'avatar'])
      .populate('uploader', 'username avatar')
      .populate({ path: 'comments', populate: { path: 'user', select: 'username avatar' } });
      

    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.views += 1;
    await video.save();

    res.json(video);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Like Video
router.put('/like/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();
    const likeIndex = video.likes.indexOf(userId);
    const dislikeIndex = video.dislikes.indexOf(userId);

    if (likeIndex === -1) {
      video.likes.unshift(userId);
      if (dislikeIndex !== -1) video.dislikes.splice(dislikeIndex, 1);
    } else {
      video.likes.splice(likeIndex, 1);
    }

    await video.save();
    res.json({ message: 'Updated like status' });

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update a video
router.put('/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const allowedFields = ['title','description','thumbnailUrl','videoUrl','category','tags','visibility'];

    allowedFields.forEach((field)=>{ 
      if(req.body[field] !== undefined) video[field] = req.body[field]
    });

    await video.save();
    res.json({ message: "Video updated successfully", video });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});


// Dislike Video
router.put('/dislike/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();
    const dislikeIndex = video.dislikes.indexOf(userId);
    const likeIndex = video.likes.indexOf(userId);

    if (dislikeIndex === -1) {
      // Add dislike
     video.dislikes.unshift(userId);
      
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

router.get('/channel/:channelId', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const videos = await Video.find({ channel: channel._id, visibility: 'public' })
      .sort({ createdAt: -1 })
    .populate('channel', ['channelName', 'avatar']);

    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


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
   .populate('channel', ['channelName', 'avatar']);

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

export default router;
