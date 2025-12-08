import express from "express";
import cors from "cors";
import { connectDB, PORT } from "./src/config/db.js";
import { seedVideos } from "./seed.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import channelRoutes from "./src/routes/channelRoutes.js";
import videoRoutes from "./src/routes/videoRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Start Server
connectDB().then(async () => {
  console.log("✔ Database connected");

  await seedVideos(); // will auto insert sample videos if none exist

  app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
});
