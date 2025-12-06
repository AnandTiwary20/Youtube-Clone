import express from "express";
import { authenticate } from "../middleware/auth.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

const router = express.Router();

/* CREATE COMMENT */
router.post("/:videoId", authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text required" });

    const comment = await Comment.create({
      text,
      user: req.user._id,
      video: req.params.videoId,
    });

    await Video.findByIdAndUpdate(req.params.videoId, {
      $push: { comments: comment._id },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

/* GET VIDEO COMMENTS */
router.get("/:videoId", async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to load comments" });
  }
});

/* EDIT COMMENT */
router.put("/edit/:id", authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    comment.text = req.body.text;
    comment.isEdited = true;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Error updating comment" });
  }
});

/* DELETE COMMENT */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    await Comment.findByIdAndDelete(req.params.id);

    // Remove comment reference from video
    await Video.findByIdAndUpdate(comment.video, {
      $pull: { comments: comment._id }
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting comment" });
  }
});

export default router;
