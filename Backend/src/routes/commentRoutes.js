import express from "express";
import { authenticate } from "../middleware/auth.js";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

/* CREATE COMMENT */
router.post("/:videoId", authenticate, createComment);

/* GET COMMENTS */
router.get("/:videoId", getComments);

/* UPDATE COMMENT */
router.put("/:id", authenticate, updateComment);

/* DELETE COMMENT */
router.delete("/:id", authenticate, deleteComment);

export default router;
