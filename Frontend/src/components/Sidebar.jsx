import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="section">
        <Link to="/">🏠 Home</Link>
        <Link to="/subscriptions">📺 Subscriptions</Link>
        <Link to="/shorts">🎬 Shorts</Link>
      </div>

      <hr />

      <div className="section">
        <h4>Subscriptions</h4>
        <Link>8bit Binks69</Link>
        <Link>Animal Planet</Link>
        <Link>BBC Earth</Link>
        <Link>ABP News</Link>
        <Link>Show more</Link>
      </div>

      <hr />

      <div className="section">
        <h4>You</h4>
        <Link to="/library">📚 Library</Link>
        <Link to="/history">⏳ History</Link>
        <Link>👍 Liked</Link>
      </div>
    </aside>
  );
}
