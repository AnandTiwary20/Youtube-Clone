import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import "../styles/VideoPlayer.css";
import CommentSection from "../pages/CommentSection.jsx";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    fetchVideo();
    fetchRecommended();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await API.get(`/videos/${id}`);
      setVideo(res.data);
    } catch {
      console.log("Video load failed");
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await API.get("/videos?limit=25");
      setRecommended(res.data.videos || []);
    } catch {}
  };

  // LIKE the video
  const likeVideo = async () => {
    await API.put(`/videos/like/${id}`);
    fetchVideo();
  };

  // DISLIKE the video
  const dislikeVideo = async () => {
    await API.put(`/videos/dislike/${id}`);
    fetchVideo();
  };

  // SUBSCRIBE the channel but login is required to subscribe
  const subscribeFromVideo = async () => {
    try {
      await API.put(`/channels/subscribe/${video.channel?._id}`);
      fetchVideo();
    } catch {
      alert("Login required");
      navigate("/login");
    }
  };

  if (!video) return <h2 className="loader">Loading video...</h2>;

  const isSubscribed = video?.channel?.subscribers?.includes(video.uploader);

  return (
    <div className="video-page">

      {/* LEFT PLAYER */}
      <div className="video-left">

        {/* 🎥 AUTO DETECT PLAYER */}

        {
        video.videoUrl.includes("youtube.com")
        ? (
          <iframe
            className="video-player"
            width="100%"
            height="450"
            src={video.videoUrl.replace("watch?v=", "embed/")}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video 
            className="video-player" 
            controls 
            autoPlay 
            src={video.videoUrl} 
            poster={video.thumbnailUrl} 
          />
        )}

        <h2 className="video-title">{video.title}</h2>

        <div className="video-info-row">
          <span>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</span>

          <div className="action-buttons">
            <button onClick={likeVideo}><i className="bi bi-hand-thumbs-up-fill"></i> {video.likes?.length}</button>
            <button onClick={dislikeVideo}><i className="bi bi-hand-thumbs-down-fill"></i> {video.dislikes?.length}</button>
            <button>⤴ Share</button>
          </div>
        </div>

        {/* CHANNEL BOX */}
        <div className="channel-box">
          <img 
            className="channel-avatar"
            src={video.channel?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
          />

          <div>
            <Link to={`/channel/${video.channel?._id}`}>
              <h4 className="channel-name">{video.channel?.channelName}</h4>
            </Link>
            <p className="sub-count">{video.channel?.subscribers?.length} subscribers</p>
          </div>

          <button 
            className={`subscribe-btn ${isSubscribed ? "active" : ""}`} 
            onClick={subscribeFromVideo}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="description-box">{video.description}</div>

        {/* COMMENTS */}
        <CommentSection videoId={id} />
      </div>


      {/* RIGHT - RECOMMENDED */}
      <div className="recommended-box">
        <h3 className="rec-title">Recommended</h3>

        {recommended.filter(v => v._id !== id).map(v => (
          <Link key={v._id} to={`/video/${v._id}`} className="rec-item">
            <img src={v.thumbnailUrl} />

            <div className="rec-info">
              <p className="rec-name">{v.title}</p>
              <p className="rec-channel">{v.channel?.channelName}</p>
              <span className="rec-views">{v.views} views</span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
