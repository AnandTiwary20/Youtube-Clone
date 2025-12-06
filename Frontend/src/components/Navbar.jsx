import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-50">
      
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-red-600 flex gap-1 items-center">
        ▶ YouTube <span className="text-black font-semibold">Clone</span>
      </Link>

      {/* Search */}
      <div className="flex items-center w-1/2">
        <input type="text" placeholder="Search"
          className="w-full p-2 border rounded-l-full border-gray-300 focus:ring-1 focus:ring-red-500 outline-none" />
        <button className="px-4 py-2 bg-gray-100 border rounded-r-full border-gray-300">🔍</button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="font-medium">Hi, {user?.username}</span>
            <button onClick={() => dispatch(logout())}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="font-medium hover:text-black">Sign In</Link>
            <Link to="/register" className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
