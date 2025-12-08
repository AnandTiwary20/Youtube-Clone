import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import "../styles/ChannelPage.css";

export default function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannel();
    fetchVideos();
    window.scrollTo(0,0);
  }, [id]);

  const fetchChannel = async () => {
    try {
      const res = await API.get(`/channels/${id}`);
      setChannel(res.data.channel || res.data);
    } catch {
      alert("Channel not found");
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await API.get(`/videos/channel/${id}`);
      setVideos(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = channel?.subscribers?.includes(channel?.owner?._id);

  const handleSubscribe = async () => {
    try {
      const res = await API.put(`/channels/subscribe/${id}`);
      setChannel(prev => ({
        ...prev,
        subscribers: Array(res.data.subscribers).fill(0),
        isSubscribed: res.data.subscribed
      }));
    } catch {
      alert("Login required");
    }
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await API.delete(`/videos/${videoId}`);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <h2 className="loader">Loading channel...</h2>;
  if (!channel) return <h2>Channel not found</h2>;

  return (
    <div className="channel-container">

      <div className="channel-banner" 
        style={{backgroundImage:`url(${channel.channelBanner || 'https://i.imgur.com/TDLz0nH.jpeg'})`}} />

      <div className="channel-header">
        <img src={channel.avatar || "/default-avatar.png"} className="channel-avatar" />

        <div>
          <h1>{channel.channelName}</h1>
          <p className="subs">{channel?.subscribers?.length} subscribers</p>
        </div>

        <button className="manage-btn">⚙ Manage</button>

        <button 
          className={`sub-btn ${isSubscribed ? "active" : ""}`}
          onClick={handleSubscribe}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      <div className="upload-bar">
        <Link to="/upload" className="upload-btn">📤 Upload Video</Link>
      </div>

      <h2 className="upload-title">Your Uploads</h2>

      <div className="channel-video-grid">
        {videos.length > 0 ? videos.map(v => (
          <div key={v._id} className="channel-video-card">

            <Link to={`/watch/${v._id}`}>
              <img src={v.thumbnailUrl} className="thumb" />
            </Link>

            <p className="v-title">{v.title}</p>
            <p className="v-date">{new Date(v.createdAt).toLocaleDateString()}</p>

            <div className="card-actions">
              <button onClick={() => navigate(`/edit-video/${v._id}`)}>✏ Edit</button>
              <button className="delete" onClick={() => deleteVideo(v._id)}>🗑 Delete</button>
            </div>
          </div>
        )) : <p>No videos uploaded.</p>}
      </div>

    </div>
  );
}
