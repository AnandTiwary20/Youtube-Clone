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
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await API.delete(`/videos/${videoId}`);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch {
      alert("Couldn't delete video");
    }
  };

  if (loading) return <h2 className="loader">Loading channel...</h2>;
  if (!channel) return <h2 className="loader">Channel not found</h2>;

  return (
    <div className="channel-container">

      <div
        className="channel-banner"
        style={{ backgroundImage: `url(${channel.channelBanner})` }}
      />

      <div className="channel-header">
        <img src={channel.avatar} alt="avatar" className="channel-avatar" />

        <div>
          <h1>{channel.channelName}</h1>
          <p className="subs">{channel.subscribers} subscribers</p>
        </div>

        <button className="edit-btn">
          ⚙ Manage
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
                <button onClick={() => navigate(`/edit-video/${v._id}`)}>
                  ✏ Edit
                </button>
                <button className="delete" onClick={() => deleteVideo(v._id)}>
                  🗑 Delete
                </button>
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
