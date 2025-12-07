import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import CommentSection from "../components/CommentSection";
import "../styles/VideoPlayer.css";

export default function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    fetchVideo();
    fetchRecommended();
    window.scrollTo(0, 0);
  }, [id]);

  /* Fetch Selected Video */
  const fetchVideo = async () => {
    try {
      const res = await API.get(`/videos/${id}`);
      setVideo(res.data);
    } catch {
      console.log("Video load failed");
    }
  };

  /* Fetch Recommended Videos */
  const fetchRecommended = async () => {
    try {
      const res = await API.get("/videos?limit=25");
      setRecommended(res.data.videos || []);
    } catch {}
  };

  /* Like Video */
  const likeVideo = async () => {
    await API.put(`/videos/like/${id}`);
    fetchVideo();
  };

  /* Dislike Video */
  const dislikeVideo = async () => {
    await API.put(`/videos/dislike/${id}`);
    fetchVideo();
  };

  if (!video) return <h2 className="loader">Loading video...</h2>;

  return (
    <div className="video-page">

      {/* ---------------- LEFT MAIN PLAYER ---------------- */}
      <div className="video-left">

        {/* Video player */}
        <video
          className="video-player"
          controls
          autoPlay
          src={video.videoUrl}
          poster={video.thumbnailUrl}
        />

        <h2 className="video-title">{video.title}</h2>

        {/* Views + Like/Dislike */}
        <div className="video-info-row">
          <span>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</span>

          <div className="action-buttons">
            <button onClick={likeVideo}>👍 {video.likes?.length}</button>
            <button onClick={dislikeVideo}>👎 {video.dislikes?.length}</button>
            <button>⤴ Share</button>
          </div>
        </div>

        {/* Channel Card */}
        <div className="channel-box">
          <img className="channel-avatar" src={video.channel?.avatar} alt="channel" />

          <div className="channel-info">
            <h4>{video.channel?.channelName}</h4>
            <p className="sub-count">{video.uploader?.username}</p>
          </div>

          <button className="subscribe-btn">Subscribe</button>
        </div>

        {/* Description */}
        <div className="description-box">
          {video.description || "No Description"}
        </div>

        {/* Comments Section */}
        <CommentSection videoId={id} />
      </div>



      {/* ---------------- RIGHT RECOMMENDED ---------------- */}
      <div className="recommended-box">
        <h3 className="rec-title">Recommended</h3>

        {recommended
          .filter(v => v._id !== id)
          .map(v => (
            <div
              key={v._id}
              onClick={() => (window.location = `/video/${v._id}`)}
              className="rec-item"
            >
              <img src={v.thumbnailUrl} alt="thumb" />

              <div className="rec-info">
                <p className="rec-name">{v.title}</p>
                <p className="rec-channel">{v.channel?.channelName}</p>
                <small className="rec-views">{v.views} views</small>
              </div>
            </div>
        ))}
      </div>

    </div>
  );
}
