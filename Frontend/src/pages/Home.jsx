import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import FilterBar from "../components/FilterBar";
import VideoCard from "../components/VideoCard";
import "../styles/Home.css";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    fetchVideos();
  }, [selected]);

  const fetchVideos = async () => {
    try {
      const res = selected === "All"
        ? await API.get("/videos")
        : await API.get(`/videos/category/${selected}`);

      setVideos(res.data.videos || res.data);
    } catch (err) {
      console.log("Error fetching videos:", err);
    }
  };

  return (
    <div className="home-container">

      {/* Filters */}
      <FilterBar selected={selected} setSelected={setSelected} />

      <h2 className="section-title">{selected} Videos</h2>

  <div className="video-grid">
  {videos.length > 0 ? (
    videos.map(video => (
      <VideoCard key={video._id} video={video} />
    ))
  ): (
          <p className="no-video-text">No videos uploaded yet.</p>
        )}
      </div>

    </div>
  );
}
