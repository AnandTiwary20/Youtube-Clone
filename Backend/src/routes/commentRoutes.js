import express from "express";
import { auth } from "../middleware/auth.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

const router = express.Router();

// CREATE COMMENT
router.post("/:videoId", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Comment content required" });

    const comment = await Comment.create({
      content,
      user: req.user.userId,
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

// GET COMMENTS FOR A VIDEO
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

// UPDATE COMMENT
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.user.toString() !== req.user.userId)
      return res.status(403).json({ error: "Not authorized" });

    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Error updating comment" });
  }
});

// DELETE COMMENT
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.user.toString() !== req.user.userId)
      return res.status(403).json({ error: "Not authorized" });

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting comment" });
  }
});

export default router;
