import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

//comment creation logic
export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;

    if (!text) return res.status(400).json({ error: "Comment text required" });

    const comment = await Comment.create({
      text,
      user: req.user._id,
      video: videoId,
    });

    await Video.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id },
    });

    res.status(201).json(comment);

  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

//get comments for a video
export const getComments = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    const comments = await Comment.find({ video: videoId })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");

    res.json(comments);

  } catch (err) {
    res.status(500).json({ error: "Failed to load comments" });
  }
};

//edit comment only available to owner
export const updateComment = async (req, res) => {
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
};

//Delete comment only by logged in user who is the owner
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    await Comment.findByIdAndDelete(req.params.id);

    // remove it from video reference
    await Video.findByIdAndUpdate(comment.video, {
      $pull: { comments: comment._id }
    });

    res.json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};
