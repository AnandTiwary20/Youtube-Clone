import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      
      <div className="sidebar-section">
         <Link className="Create-channel" to="/create-channel"> <i class="bi bi-plus-lg"></i>  Create Channel </Link>
        <Link className="sidebar-item" to="/"> <i class="bi bi-house-door-fill"></i>Home</Link>
        <Link className="sidebar-item" to="/subscriptions"><i class="bi bi-vinyl-fill"></i> Subscriptions</Link>
        <Link className="sidebar-item" to="/shorts"><i class="bi bi-camera-reels-fill"></i>Shorts</Link>
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
        <Link className="sidebar-item" to="/library"> <i class="bi bi-collection-play"></i>Library</Link>
        <Link className="sidebar-item" to="/history">  <i class="bi bi-clock-history"></i> History</Link>
        <Link className="sidebar-item" to="/liked">  <i class="bi bi-hand-thumbs-up-fill"></i>Liked</Link>
       
      </div>

    </aside>
  );
}
