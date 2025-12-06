import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-white border-r p-4 fixed top-16 left-0">
      <ul className="space-y-4 font-medium">

        <li><Link to="/" className="hover:text-red-600">🏠 Home</Link></li>
        <li><Link>🔥 Trending</Link></li>
        <li><Link>🎵 Music</Link></li>
        <li><Link>📺 Subscriptions</Link></li>
        <li><Link>🎬 Movies</Link></li>

      </ul>
    </aside>
  );
}

