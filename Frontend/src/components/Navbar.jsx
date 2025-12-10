import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useState } from "react";

export default function Navbar({ toggleSidebar }) {

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  return (
    <header className="navbar">
      {/* Hamburger Menu */}
      <i className="bi bi-list hamburger" onClick={toggleSidebar}></i>

      {/* Logo */}
      <Link to="/" className="logo">
        <i className="bi bi-youtube youtube-icon"></i>
        <span>YouTube</span>
      </Link>

      {/* Search Bar */}
      <form className="search-area" onSubmit={handleSearch}>
        <input 
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit"><i className="bi bi-search"></i></button>
      </form>

      {/* Right Section */}
      <div className="right-section">
        {isAuthenticated ? (
          <>
            <span className="username">Hi, {user?.username}</span>

            <Link className="upload-btn" to="/upload">
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Upload</span>
            </Link>
            
            <button 
              className="logout-btn" 
              onClick={() => { dispatch(logout()); navigate("/login"); }}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </>
        ) : (
          <>
            <Link className="sign-btn" to="/login">Sign In</Link>
            <Link className="signup-btn" to="/register">Sign Up</Link>
          </>
        )}
      </div>

    </header>
  );
}
