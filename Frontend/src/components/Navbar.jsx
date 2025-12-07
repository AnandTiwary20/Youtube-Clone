import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // 🔍 Search submit function
  const handleSearch = (e) => {                         
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  return (
    <header className="navbar">

      {/* Logo */}
      <Link to="/" className="logo">
        <i className="bi bi-youtube"></i> <span>YouTube</span>
      </Link>

      {/* Search Bar */}
      <form className="search-area" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
        <button type="submit">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {/* Right Section */}
      <div className="right-section">
        {isAuthenticated ? (
          <>
            <span>Hi, {user?.username}</span>
            <button className="logout-btn" onClick={() => dispatch(logout())}>
              <i className="bi bi-door-open-fill"></i> Logout
            </button>
            <Link className="upload-btn-nav" to="/upload">
              <i className="bi bi-cloud-arrow-up-fill"></i> Upload
            </Link>
          </>
        ) : (
          <>
            <Link className="sign-btn" to="/login">
              <i className="bi bi-box-arrow-in-right"></i> Sign In
            </Link>
            <Link className="signup-btn" to="/register">
              <i className="bi bi-person-plus-fill"></i> Sign Up
            </Link>
          </>
        )}
      </div>

    </header>
  );
}
