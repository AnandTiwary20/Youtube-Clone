import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import { validationResult } from "express-validator";

/* ======================== CREATE OR UPDATE CHANNEL ======================== */
export const createOrUpdateChannel = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { channelName, description, avatar, channelBanner } = req.body;

  try {
    let channel = await Channel.findOne({ owner: req.user._id });

    // UPDATE
    if (channel) {
      channel.channelName = channelName;
      channel.description = description;
      if (avatar) channel.avatar = avatar;
      if (channelBanner) channel.channelBanner = channelBanner;

      await channel.save();
      return res.json({ message: "Channel Updated", channel });
    }

    // CREATE
    const newChannel = await Channel.create({
      channelName,
      description,
      avatar,
      channelBanner,
      owner: req.user._id,
    });

    return res.status(201).json({ message: "Channel Created", channel: newChannel });

  } catch (err) {
    console.log("CHANNEL CREATE/UPDATE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ======================== GET MY CHANNEL (OWNER PANEL) ======================== */
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id })
      .populate("owner", "username email avatar")
      .populate("videos");

    if (!channel) return res.status(404).json({ message: "No channel found" });

    res.json(channel);

  } catch (err) {
    console.log("FETCH MY CHANNEL ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ======================== GET CHANNEL + VIDEOS PUBLIC ======================== */
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar email");

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const videos = await Video.find({ channel: channel._id }).sort({ createdAt: -1 });

    res.json({ channel, videos });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ======================== SUBSCRIBE/UNSUBSCRIBE ======================== */
export const toggleSubscribe = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // user cannot sub their own channel
    if (channel.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You can't subscribe to your own channel" });

    const user = await User.findById(req.user._id);
    const subscribed = user.subscribedChannels.includes(channel._id);

    if (subscribed) {
      user.subscribedChannels.pull(channel._id);
      channel.subscribers.pull(req.user._id);
      await user.save(); await channel.save();
      return res.json({ message:"Unsubscribed", subscribed:false, subscribers:channel.subscribers.length });
    } else {
      user.subscribedChannels.push(channel._id);
      channel.subscribers.push(req.user._id);
      await user.save(); await channel.save();
      return res.json({ message:"Subscribed", subscribed:true, subscribers:channel.subscribers.length });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message:"Server error" });
  }
};

/* ======================== DELETE VIDEO BY OWNER ======================== */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.vid);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await Video.findByIdAndDelete(req.params.vid);
    return res.json({ message: "Video deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Failed to delete video" });
  }
};

/* ======================== SEARCH CHANNELS ======================== */
export const searchChannels = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Search query required" });

    const channels = await Channel.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json(channels);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
