import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import "../styles/VideoPlayer.css";
import CommentSection from "../pages/CommentSection.jsx"

export default function VideoPlayer() {
  const { id } = useParams();
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

  /* LIKE */
  const likeVideo = async () => {
    await API.put(`/videos/like/${id}`);
    fetchVideo();
  };

  /* DISLIKE */
  const dislikeVideo = async () => {
    await API.put(`/videos/dislike/${id}`);
    fetchVideo();
  };

  /* SUBSCRIBE BUTTON ACTION */
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

        <video className="video-player" controls autoPlay src={video.videoUrl} poster={video.thumbnailUrl} />

        <h2 className="video-title">{video.title}</h2>

        <div className="video-info-row">
          <span>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</span>

          <div className="action-buttons">
            <button onClick={likeVideo}>👍 {video.likes?.length}</button>
            <button onClick={dislikeVideo}>👎 {video.dislikes?.length}</button>
            <button>⤴ Share</button>
          </div>
        </div>

        {/* CHANNEL */}
        <div className="channel-box">
        <img 
             className="channel-avatar"
             src={video.channel?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
          <div>
            <Link to={`/channel/${video.channel?._id}`}>
              <h4 className="channel-name">{video.channel?.channelName}</h4>
            </Link>
            <p className="sub-count">{video.channel?.subscribers?.length} subscribers</p>
          </div>

       <button 
  className={`subscribe-btn ${video.isSubscribed ? "active" : ""}`} 
  onClick={subscribeFromVideo}
>
  {video.isSubscribed ? "Subscribed" : "Subscribe"}
</button>

        </div>

        <div className="description-box">{video.description}</div>

       
        <CommentSection videoId={id} />

      </div>


      {/* RIGHT - RECOMMENDED LIST */}
   <div className="recommended-box">
        <h3 className="rec-title">Recommended</h3>

        {recommended.filter(v => v._id !== id).map(v => (
          <Link key={v._id} to={`/watch/${v._id}`} className="rec-item">
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