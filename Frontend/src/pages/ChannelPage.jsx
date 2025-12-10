import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import "../styles/ChannelPage.css";
// ChannelPage component to display channel details and videos

export default function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  //  useEffect to fetch channel and videos on component mount or id change

  useEffect(() => {
    fetchChannel();
    fetchVideos();
    window.scrollTo(0,0);  // Scroll to top on channel change
  }, [id]);

  const fetchChannel = async () => {
    try {
      const res = await API.get(`/channels/${id}`);
      setChannel(res.data.channel || res.data);
    } catch {
      alert("Channel not found");
    }
  };
  //  Fetch videos uploaded by the channel

  const fetchVideos = async () => {
    try {
      const res = await API.get(`/videos/channel/${id}`);
      setVideos(res.data || []);
    } finally {
      setLoading(false);
    }
  };
  // Check if the user is subscribed to the channel

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
      alert("Login required");   //login is required to subscribe 
    }
  };
//  delete video function for channel owner
  const deleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    try {
       await API.delete(`/channels/video/${videoId}`);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <h2 className="loader">Loading channel...</h2>;
  if (!channel) return <h2>Channel not found</h2>;

  return (
  <div className="channel-container">

    {/* ---------- Banner ---------- */}
    <div
      className="channel-banner"
      style={{ backgroundImage:`url(${channel.channelBanner || 'https://i.imgur.com/TDLz0nH.jpeg'})` }}
    />

    {/* ---------- Profile + Buttons ---------- */}
    <div className="channel-info">
      <img
        src={channel.avatar || "/default-avatar.png"}
        className="channel-avatar"
      />

      <div className="info-text">
        <h1>{channel.channelName}</h1>
        <p>{channel?.subscribers?.length} subscribers • {videos.length} videos</p>
      </div>

      <button className="manage-btn">⚙ Manage</button>
 
      <button
        className={`sub-btn ${isSubscribed ? "active" : ""}`}
        onClick={handleSubscribe}
      >
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>

    {/* ---------- Upload section ---------- */}
    <div className="top-actions">
      <Link to="/upload" className="upload-link">📤 Upload Video</Link>
    </div>

    <h2 className="section-title">Your Uploads</h2>

    {/* ---------- Video Grid ---------- */}
    <div className="video-grid">
      {videos.length > 0 ? videos.map(v => (
        <div key={v._id} className="video-card">

          <Link to={`/watch/${v._id}`}>
            <img src={v.thumbnailUrl} className="thumb" />
          </Link>

          <div className="video-meta">
            <p className="video-title">{v.title}</p>
            <p className="video-date">{new Date(v.createdAt).toLocaleDateString()}</p>

            <div className="card-actions">
              <button className="edit-btn" onClick={() => navigate(`/edit-video/${v._id}`)}>✏ Edit</button>
              <button className="delete-btn" onClick={() => deleteVideo(v._id)}>🗑 Delete</button>
            </div>
          </div>

        </div>
      )) : <p style={{padding:"20px 60px"}}>No videos uploaded.</p>}
    </div>

  </div>
);
}