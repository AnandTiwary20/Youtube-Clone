import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { check } from 'express-validator';

import {
  uploadVideo,
  getAllVideos,
  getByCategory,
  getVideo,
  likeVideo,
  dislikeVideo,
  updateVideo,
  getByChannel,
  searchVideos
} from '../controllers/videoController.js';

const router = express.Router();

router.post("/upload", [
  authenticate,
  check("title").notEmpty(),
  check("videoUrl").notEmpty(),
  check("thumbnailUrl").notEmpty()
], uploadVideo);

router.get("/", getAllVideos);
router.get("/category/:type", getByCategory);
router.get("/channel/:channelId", getByChannel);
router.get("/search", searchVideos);
router.get("/:id", getVideo);

router.put("/like/:id", authenticate, likeVideo);
router.put("/dislike/:id", authenticate, dislikeVideo);
router.put("/:id", authenticate, updateVideo);

export default router;
