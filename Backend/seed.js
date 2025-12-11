import Video from "./src/models/Video.js";
import User from "./src/models/User.js";
import Channel from "./src/models/Channel.js";

//Totally optional seed file to add initial data like videos and a user for testing purposes
// Run this file once after setting up the backend to add seed data
//just run node server js it will seed automatically if no video exist .

export const seedVideos = async () => {
  try {
    const count = await Video.countDocuments();
    if (count > 0) {
      console.log("Videos already exist — skipping seeding");
      return;
    }

    console.log("\n Seeding initial data...\n");

    // Create Seed User
    let user = await User.findOne({ email: "seeduser@example.com" });
    if (!user) {
      user = await User.create({
        username: "DemoUser",
        email: "seeduser@example.com",
        password: "123456",
        avatar: "https://i.pravatar.cc/150?img=12"
      });
      console.log("✔ User Created");
    }

    //  Create Seed Channel
    let channel = await Channel.findOne({ owner: user._id });
    if (!channel) {
      channel = await Channel.create({
        channelName: "Demo Music Channel",
        description: "Channel seeded with YouTube music videos",
        owner: user._id,
        avatar: "https://i.pravatar.cc/150?img=12",
        channelBanner: "https://picsum.photos/1300/300?random=2"
      });
      console.log("✔ Channel Created");
    }

    // Your YouTube Videos
    const demoVideos = [
      {
        title: "Ishq Jalakar",
        description: "Hit emotional Urdu song by AUR",
        thumbnailUrl: "https://i.ytimg.com/vi/8qCVXCFREkQ/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=8qCVXCFREkQ",
        views: 120000000,
        category: "Music",
        tags: ["aur", "Ishq jalakar", "music"]
      },
      {
        title: "Kantara Tittle track",
        description: " track with deep vibe and visuals",
        thumbnailUrl: "https://i.ytimg.com/vi/m-5ck3BuT1o/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=m-5ck3BuT1o",
        views: 55000000,
        category: "Music",
        tags: ["pray", "South", "intense"]
      },{
       title: "Learn React in 30 Minutes",
        description: " A quick tutorial to get started with React",
        thumbnailUrl: "https://example.com/thumbnails/react30min.png",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        views: 54000,
        category: "Education",
        tags: ["Study", "Education", "React"]

        },
      


    ];

    // Insert videos + attach to channel
    for (const vid of demoVideos) {
      const video = await Video.create({
        ...vid,
        uploader: user._id,
        channel: channel._id
      });

      channel.videos.push(video._id);
    }

    await channel.save();

    console.log(" Seed Completed Successfully — Your Music Videos Added!\n");

  } catch (err) {
    console.log("Seed Error:", err.message);
  }
};
