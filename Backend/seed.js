import Video from "./src/models/Video.js";
import User from "./src/models/User.js";
import Channel from "./src/models/Channel.js";

export const seedVideos = async () => {
  const count = await Video.countDocuments();
  if (count > 0) return console.log("📌 Videos already exist — skip\n");

  // create a test user
let user = await User.findOne({ email: "demo@gmail.com" });
if (!user) {
  user = await User.create({
    username: "Demo2User",
    email: "demo2@gmail.com",
    password: "123456"
  });
}

  // create default channel
 let channel = await Channel.findOne({ channelName: "Demo Channel" });
if (!channel) {
  channel = await Channel.create({
    channelName: "Demo Channel",
    description: "Auto generated sample channel",
    owner: user._id,
    avatar: "https://picsum.photos/200",
    channelBanner: "https://picsum.photos/1200/300"
  });
}

  const categories = ["Music","Gaming","Tech","Education","Comedy","Sports"];

  const sampleVideos = Array.from({ length: 20 }).map((_, i) => ({
    title: `Sample Video ${i+1}`,
    description: "Auto generated video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: `https://picsum.photos/seed/thumb${i}/400/250`,
    duration: `${Math.floor(Math.random()*8)+2}:${Math.floor(Math.random()*59)}`,
    views: Math.floor(Math.random() * 100000),
    category: categories[Math.floor(Math.random()*categories.length)],
    tags: ["demo","sample"],
    uploader: user._id,
    channel: channel._id,
  }));

  await Video.insertMany(sampleVideos);
  console.log("🎉 20 Demo videos inserted");
};
