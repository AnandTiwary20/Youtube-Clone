import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import "../styles/VideoPlayer.css";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await API.get(`/videos/${id}`);
      setVideo(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading video...</div>;
  if (!video) return <div className="error">Video not found</div>;

  return (
    <div className="video-screen">

      {/* ===================== LEFT SECTION ===================== */}
      <div className="video-left">

        <video 
          src={video.videoUrl} 
          controls 
          poster={video.thumbnailUrl} 
          className="video-player"
        />

        <h2 className="video-title">{video.title}</h2>

        <div className="video-stats">
          <span>{video.views} views</span>
          <span>• {new Date(video.createdAt).toLocaleDateString()}</span>

          <div className="actions">
            <button className="like-btn">👍 {video.likes?.length || 0}</button>
            <button className="dislike-btn">👎 {video.dislikes?.length || 0}</button>
            <button className="share-btn">↗ Share</button>
          </div>
        </div>

        {/* Channel Box */}
        <div className="channel-card">
          <img src={video?.channel?.avatar} className="channel-img" />
          <div className="channel-info">
            <h3>{video.channel?.channelName}</h3>
            <p className="sub-count">1.2M subscribers</p>
          </div>
          <button className="subscribe-btn">Subscribe</button>
        </div>

        <p className="description">{video.description}</p>

        {/* Placeholder now – We will build comments next step */}
        <div className="coming">💬 Comments section coming next →</div>

      </div>

      {/* ===================== RIGHT RECOMMENDED ===================== */}
      <div className="video-right">
        <h3 className="rec-title">Recommended</h3>

        <div className="rec-item">
          <img src={video.thumbnailUrl} />
          <div>
            <p className="rec-name">{video.title}</p>
            <span className="rec-channel">{video.channel?.channelName}</span>
          </div>
        </div>

        <div className="rec-item">
          <img src={video.thumbnailUrl} />
          <div>
            <p className="rec-name">Another Example Video</p>
            <span className="rec-channel">{video.channel?.channelName}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
