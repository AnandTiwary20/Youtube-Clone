import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import "../styles/Home.css";

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
    <div className="home-container">
      <h2 className="section-title">Recommended</h2>

      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map((video) => (
            <Link key={video._id} to={`/video/${video._id}`} className="video-card">
              
              <div className="thumbnail">
                <img src={video.thumbnailUrl} alt="thumbnail" />
              </div>

              <div className="video-info">
                <h4 className="video-title">{video.title}</h4>
                <p className="video-channel">{video.channel?.channelName || "Unknown Channel"}</p>
                <p className="video-stats">
                  {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>

            </Link>
          ))
        ) : (
          <p className="no-video-text">No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
