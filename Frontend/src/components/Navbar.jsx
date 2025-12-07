import "../styles/Navbar.css";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="navbar">

      <Link to="/" className="logo">
       <i className="bi bi-youtube"></i> YouTube <span></span>
      </Link>

      <div className="search-area">
        <input type="text" placeholder="Search..." />
        <button><i class="bi bi-search-heart-fill"></i></button>
      </div>

      <div className="right-section">
        {isAuthenticated ? (
          <>
            <span>Hi, {user?.username}</span>
            <button className="logout-btn" onClick={() => dispatch(logout())}>Logout</button>
            <Link className="upload-btn-nav" to="/upload"> <i class="bi bi-bag-plus-fill"></i>Upload</Link>

          </>
        ) : (
          <>
            <Link className="sign-btn" to="/login">Sign In</Link>
            <Link className="signup-btn" to="/register">Sign Up  <i class="bi bi-arrow-bar-up"></i></Link>
          </>
        )}
      </div>

    </header>
  );
}
