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
app.use(express.json({ limit: "10mb" }));   

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Basic route to check API status
app.get("/", (req,res)=>{
  res.json({ status:"API Running", message:"YouTube Clone Backend Up " });
});

// error handling middleware
app.use((err, req, res, next)=>{
  console.error("Server Error:", err);
  res.status(500).json({ message:"Internal Server Error" });
});

//server is started from here after db connection is done
connectDB().then(async ()=>{
  console.log(" Database connected");

  await seedVideos(); 

  app.listen(PORT, ()=>{
    console.log(` Server running at http://localhost:${PORT}`);
  });
});
