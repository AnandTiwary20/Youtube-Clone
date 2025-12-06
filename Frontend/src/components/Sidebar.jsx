import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      
      <div className="sidebar-section">
        <Link className="sidebar-item" to="/">🏠 Home</Link>
        <Link className="sidebar-item" to="/subscriptions">📺 Subscriptions</Link>
        <Link className="sidebar-item" to="/shorts">🎬 Shorts</Link>
      </div>

      <h4 className="sidebar-title">Subscriptions</h4>
      <div className="sidebar-section">
        <Link className="sidebar-item">8bit Binks69</Link>
        <Link className="sidebar-item">Animal Planet</Link>
        <Link className="sidebar-item">BBC Earth</Link>
        <Link className="sidebar-item">ABP News</Link>
        <Link className="sidebar-item">Show more</Link>
      </div>

      <h4 className="sidebar-title">You</h4>
      <div className="sidebar-section">
        <Link className="sidebar-item" to="/library">📁 Library</Link>
        <Link className="sidebar-item" to="/history">⌛ History</Link>
        <Link className="sidebar-item" to="/liked">👍 Liked</Link>
        <Link to="/create-channel">  ➕ Create Channel </Link>
      </div>

    </aside>
  );
}
