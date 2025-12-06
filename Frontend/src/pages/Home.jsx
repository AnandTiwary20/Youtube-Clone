import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import FilterBar from "../components/FilterBar";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    fetchVideos();
  }, [selected]);

  const fetchVideos = async () => {
    try {
      let res;
      if (selected === "All") res = await API.get("/videos");
      else res = await API.get(`/videos/category/${selected}`);

      setVideos(res.data.videos || res.data);
    } catch (err) {
      console.log("Error fetching videos:", err);
    }
  };

  return (
    <div className="home-container">

      {/* Category Filter Bar */}
      <FilterBar selected={selected} setSelected={setSelected} />

      <div className="content-area">
        <h2 className="section-title">{selected} Videos</h2>

        <div className="video-grid">
          {videos.length > 0 ? (
            videos.map((video) => (
              <Link key={video._id} to={`/video/${video._id}`} className="video-card">
                
                <div className="thumbnail">
                  <img src={video.thumbnailUrl} alt="thumbnail" />
                  <span className="duration">{video.duration || "10:00"}</span>
                </div>

                <div className="video-info">
                  <div className="channel-logo"></div>

                  <div>
                    <h4 className="video-title">{video.title}</h4>
                    <p className="video-channel">{video.channel?.channelName || "Unknown Channel"}</p>
                    <p className="video-stats">
                      {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-video-text">No videos uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
