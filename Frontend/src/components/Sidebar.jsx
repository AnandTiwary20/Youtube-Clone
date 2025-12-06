import "../styles/Sidebar.css";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/subscriptions">📺 Subscriptions</Link></li>
        <li><Link to="/shorts">🎬 Shorts</Link></li>
        <li><Link to="/library">📚 Library</Link></li>
        <li><Link to="/history">⏳ History</Link></li>
      </ul>
    </aside>
  );
}
