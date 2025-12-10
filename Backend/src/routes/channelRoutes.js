import express from "express";
import { authenticate } from "../middleware/auth.js";
import { check } from "express-validator";
//controller imports


import {
  createOrUpdateChannel,
  getMyChannel,
  getChannelById,
  toggleSubscribe,
  deleteVideo,
  searchChannels
} from "../controllers/channelController.js";

const router = express.Router();

// Routes for channel operations

router.post(
  "/",
  [
    authenticate,
    check("channelName").notEmpty(),
    check("description").notEmpty()
  ],
  createOrUpdateChannel
);

//get my channel

router.get("/me", authenticate, getMyChannel);
router.get("/search", searchChannels);
router.get("/:id", getChannelById);
router.put("/subscribe/:channelId", authenticate, toggleSubscribe);
router.delete("/video/:vid", authenticate, deleteVideo);

export default router;
