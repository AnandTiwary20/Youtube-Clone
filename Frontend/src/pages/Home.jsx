import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await API.get("/videos");
      setVideos(res.data.videos || res.data);
    } catch (err) {
      console.log("Error fetching videos:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Recommended</h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {videos.length > 0 ? (
          videos.map((video) => (
            <Link key={video._id} to={`/video/${video._id}`} className="group">
              <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  alt="thumbnail"
                />
              </div>

              <div className="mt-2 flex gap-3">
                <img
                  src={video.channel?.avatar}
                  className="w-10 h-10 rounded-full"
                  alt="channel"
                />
                <div>
                  <h3 className="font-semibold text-sm">{video.title}</h3>
                  <p className="text-gray-600 text-xs">{video.channel?.channelName}</p>
                  <p className="text-gray-500 text-xs">
                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
