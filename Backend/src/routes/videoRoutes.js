import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { check } from 'express-validator';

//controller imports

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

// Video routes

const router = express.Router();

// upload video to a channel

router.post("/upload", [
  authenticate,
  check("title").notEmpty(),
  check("videoUrl").notEmpty(),
  check("thumbnailUrl").notEmpty()
], uploadVideo);

//  get all videos
router.get("/", getAllVideos);
router.get("/category/:type", getByCategory);
router.get("/channel/:channelId", getByChannel);
router.get("/search", searchVideos);
router.get("/:id", getVideo);

router.put("/like/:id", authenticate, likeVideo);
router.put("/dislike/:id", authenticate, dislikeVideo);
router.put("/:id", authenticate, updateVideo);

export default router;
