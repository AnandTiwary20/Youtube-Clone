import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
// sidebar component for navigation links
export default function Sidebar({ isOpen }) {
  return (
    // sidebar open and collapsed state and logic 
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>

      <div className="sidebar-section">
        <Link className="sidebar-item" to="/create-channel">
          <i className="bi bi-plus-circle"></i> <span>Create Channel</span>
        </Link>
        <Link className="sidebar-item" to="/">
          <i className="bi bi-house-door"></i> <span>Home</span>
        </Link>
        <Link className="sidebar-item" to="/subscriptions">
          <i className="bi bi-collection-play"></i> <span>Subscriptions</span>
        </Link>
        <Link className="sidebar-item" to="/shorts">
          <i className="bi bi-camera-video"></i> <span>Shorts</span>
        </Link>
      </div>

      <hr className="divider"/>

      <h4 className="sidebar-title">Trending</h4>
      <div className="sidebar-section">
        <Link className="sidebar-item">Music</Link>
        <Link className="sidebar-item">Gaming</Link>
        <Link className="sidebar-item">Tech</Link>
        <Link className="sidebar-item">News</Link>
        <Link className="sidebar-item">Sports</Link>
        <Link className="sidebar-item">Movies</Link>
      </div>

      <hr className="divider"/>

      <h4 className="sidebar-title">Library</h4>
      <div className="sidebar-section">
        <Link className="sidebar-item" to="/history">
          <i className="bi bi-clock-history"></i> <span>History</span>
        </Link>
        <Link className="sidebar-item" to="/liked">
          <i className="bi bi-hand-thumbs-up"></i> <span>Liked Videos</span>
        </Link>
      </div>

    </aside>
  );
}
