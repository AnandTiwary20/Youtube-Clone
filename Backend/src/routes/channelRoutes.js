import express from "express";
import { check, validationResult } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

const router = express.Router();

/* ========================= CREATE or UPDATE CHANNEL ========================= */
router.post(
  "/",
  [
    authenticate,
    [
      check("channelName", "Channel name is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { channelName, description, avatar, channelBanner } = req.body;

    try {
      let channel = await Channel.findOne({ owner: req.user._id });

      // UPDATE if channel exists
      if (channel) {
        channel.channelName = channelName;
        channel.description = description;
        channel.avatar = avatar ?? channel.avatar;
        channel.channelBanner = channelBanner ?? channel.channelBanner;
        await channel.save();
        return res.json({ message: "Channel Updated", channel });
      }

      // CREATE new
      const newChannel = await Channel.create({
        channelName,
        description,
        avatar,
        channelBanner,
        owner: req.user._id,
      });

      return res.status(201).json({ message: "Channel Created", channel: newChannel });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

/* ========================= GET MY CHANNEL (OWNER PANEL) ========================= */
router.get("/me", authenticate, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id })
      .populate("owner", "username email avatar")
      .populate("videos");

    if (!channel) return res.status(404).json({ message: "No channel found" });

    res.json(channel);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ========================= GET CHANNEL + VIDEOS ========================= */
router.get("/:id", async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar email");

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const videos = await Video.find({ channel: channel._id })
      .sort({ createdAt: -1 });

    res.json({ channel, videos });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

/* ========================= SUBSCRIBE / UNSUBSCRIBE CHANNEL ========================= */
router.put("/subscribe/:channelId", authenticate, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: "Cannot subscribe to yourself" });

    const user = await User.findById(req.user._id);

    const isSubscribed = user.subscribedChannels.includes(channel._id);

    if (isSubscribed) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { subscribedChannels: channel._id } });
      await Channel.findByIdAndUpdate(channel._id, { $pull: { subscribers: req.user._id } });
      return res.json({ message: "Unsubscribed" });
    }

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { subscribedChannels: channel._id } });
    await Channel.findByIdAndUpdate(channel._id, { $addToSet: { subscribers: req.user._id } });

    res.json({ message: "Subscribed" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ========================= DELETE VIDEO BY OWNER ========================= */
router.delete("/video/:vid", authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.vid);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await Video.findByIdAndDelete(req.params.vid);
    res.json({ message: "Video deleted successfully" });

  } catch {
    res.status(500).json({ message: "Failed to delete video" });
  }
});

/* ========================= SEARCH CHANNELS ========================= */
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Search query required" });

    const channels = await Channel.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json(channels);

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
