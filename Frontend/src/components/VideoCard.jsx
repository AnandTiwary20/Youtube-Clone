import { Link } from "react-router-dom";
import "../styles/VideoCard.css";

export default function VideoCard({ video }) {
  
  return (
    <Link to={`/video/${video._id}`} className="video-card">

      {/* Thumbnail */}
      <div className="thumbnail-container">
        <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
      </div>

      {/* Details Section */}
      <div className="video-details">
        
        {/* Channel Icon */}
        <div className="channel-logo">
          <img 
            src={video.channel?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="channel"
          />
        </div>
        
        {/* Title & Info */}
        <div className="info">
          <h4 className="title">{video.title}</h4>

          <p className="meta">
            {video.channel?.channelName || "Unknown Channel"}
          </p>

          <p className="meta small">
            {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

    </Link>
  );
}
