import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import { validationResult } from "express-validator";

//Upload video to a channel logic 
export const uploadVideo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

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
};

//get all the videos with pagination
export const getAllVideos = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('channel', ['channelName', 'avatar']);

    const total = await Video.countDocuments({ visibility: 'public' });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//Filter videos by category
export const getByCategory = async (req, res) => {
  try {
    const videos = await Video.find({ category: req.params.type, visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('channel', ['channelName', 'avatar']);

    res.json(videos);

  } catch (err) {
    res.status(500).send('Server Error');
  }
};

//get a single video 
export const getVideo = async (req, res) => {
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
};

//Like video logic is here 
export const likeVideo = async (req, res) => {
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
};

//Dislike video logic is here
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();
    const dislikeIndex = video.dislikes.indexOf(userId);
    const likeIndex = video.likes.indexOf(userId);

    if (dislikeIndex === -1) {
      video.dislikes.unshift(userId);
      if (likeIndex !== -1) video.likes.splice(likeIndex, 1);
    } else {
      video.dislikes.splice(dislikeIndex, 1);
    }

    await video.save();
    res.json({ message: 'Dislike toggled' });

  } catch (err) {
    res.status(500).send('Server Error');
  }
};

//update video details by the owner
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    const allowed = ['title', 'description', 'thumbnailUrl', 'videoUrl', 'category', 'tags', 'visibility'];

    allowed.forEach(field => { 
      if (req.body[field] !== undefined) video[field] = req.body[field];
    });

    await video.save();
    res.json({ message: 'Video updated', video });

  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

//get videos by channel id 
export const getByChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const videos = await Video.find({ channel: channel._id, visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('channel', ['channelName','avatar']);

    res.json(videos);

  } catch (err) {
    res.status(500).send('Server Error');
  }
};

//Search video by title 
export const searchVideos = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Search query required' });

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find(
      { $text: { $search: query }, visibility: 'public' },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })
     .skip(skip).limit(limit)
     .populate('channel', ['channelName', 'avatar']);

    const total = await Video.countDocuments({ $text: { $search: query }, visibility: 'public' });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });

  } catch (err) {
    res.status(500).send('Server Error');
  }
};
