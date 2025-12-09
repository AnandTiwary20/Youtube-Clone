import Video from "./src/models/Video.js";
import User from "./src/models/User.js";
import Channel from "./src/models/Channel.js";

export const seedVideos = async () => {
  const count = await Video.countDocuments();
  if (count > 0) return console.log("📌 Videos already exist — skip\n");

  // Create test user
  let user = await User.findOne({ email: "john@gmail.com" });
  if (!user) {
    user = await User.create({
      username: "johnDoe2User",
      email: "john@gmail.com",
      password: "123456"
    });
  }

  // Create default channel
  let channel = await Channel.findOne({ channelName: "John Channel" });
  if (!channel) {
    channel = await Channel.create({
      channelName: "John Channel",
      description: "Auto generated sample channel",
      owner: user._id,
      avatar: "https://picsum.photos/200",
      channelBanner: "https://picsum.photos/1200/300"
    });
  }

  const categories = ["Music","Gaming","Tech","Education","Comedy","Sports"];

  // Seed 20 videos
  const sampleVideos = Array.from({ length: 20 }).map((_, i) => ({
    title: `Sample Video ${i+1}`,
    description: "Auto generated video example",
    youtubeId: "w7ejDZ8SWv8", // YouTube ID (Change if you want different videos)
    videoUrl: "",     // blank = YouTube will be used
    thumbnailUrl: `https://picsum.photos/seed/video${i}/400/250`,
    duration: "10:00",
    views: Math.floor(Math.random() * 50000),
    category: categories[Math.floor(Math.random()*categories.length)],
    uploader: user._id,
    channel: channel._id,
    likes: [],
    dislikes: [],
    comments: [],
  }));

  await Video.insertMany(sampleVideos);
  console.log("🎉 20 sample YouTube videos inserted!");
};
