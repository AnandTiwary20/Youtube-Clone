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
      setChannel(res.data);
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

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await API.delete(`/videos/${videoId}`);
      setVideos(prev => prev.filter(v => v._id !== videoId));
    } catch {
      alert("Failed to delete video");
    }
  };

  if (loading) return <h2 className="loader">Loading channel...</h2>;
  if (!channel) return <h2 className="loader">Channel not found</h2>;
  const handleSubscribe = async () => {
  try {
    const res = await API.put(`/channels/subscribe/${id}`);

    // Update state without refresh
 setChannel(prev => ({
  ...prev,
  subscribers: res.data.subscribers,  // now updates count properly
  isSubscribed: res.data.subscribed
}));

  } catch {
    alert("Login required to subscribe");
  }
};


  return (
    <div className="channel-container">

      <div className="channel-banner" style={{ backgroundImage:`url(${channel.channelBanner})` }} />

      {/* Channel Header */}
      <div className="channel-header">
        <img src={channel.avatar} alt="avatar" className="channel-avatar" />

        <div>
          <h1>{channel.channelName}</h1>
         <p className="subs">{channel.subscribers} subscribers</p>

        </div>

        <button className="manage-btn">⚙ Manage</button>
        <button 
  className={`sub-btn ${channel.isSubscribed ? "active" : ""}`}
  onClick={handleSubscribe}
>
  {channel.isSubscribed ? "Subscribed" : "Subscribe"}
</button>

      </div>

      <h2 className="upload-title">Your Uploads</h2>

      <div className="channel-video-grid">

        {videos.length > 0 ? (
          videos.map((v) => (
            <div key={v._id} className="channel-video-card">
              
              <Link to={`/video/${v._id}`}>
                <img src={v.thumbnailUrl} className="thumb" />
              </Link>

              <p className="v-title">{v.title}</p>
              <p className="v-date">{new Date(v.createdAt).toLocaleDateString()}</p>

              <div className="card-actions">
                <button onClick={() => navigate(`/edit-video/${v._id}`)}>✏ Edit</button>
                <button className="delete" onClick={() => deleteVideo(v._id)}>🗑 Delete</button>
              </div>

            </div>
          ))
        ) : (
          <p>No videos yet.</p>
        )}

      </div>
    </div>
  );
}
