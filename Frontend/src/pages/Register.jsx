import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import "../styles/Register.css";
import "../styles/AuthClose.css";
// Register component for user registration
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // state management

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match ❌");

try {
  setLoading(true);
  const res = await API.post("/auth/register", {
    username: formData.username,
    email: formData.email,
    password: formData.password,
  });

  dispatch(loginSuccess({
    token: res.data.token,
    user: res.data.user
  }));

  navigate("/");
} catch (err) {
  setError(err.response?.data?.message || "Registration Failed");
}
setLoading(false);
// handle form submission for registration

  };

  return (
    <div className="register-page">

      <div className="auth-close" onClick={() => navigate("/")}>✖</div>

      <div className="register-box">
        
        <h2 className="title">Create Your YouTube Account</h2>
        <p className="subtitle">Watch, Upload, Share</p>

        {error && <p className="error-box">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username"
              placeholder="Enter username please "
              value={formData.username} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter email please"
              value={formData.email} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Enter password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span 
                onClick={() => setShowPass(!showPass)} 
                className="toggle-pass"
              >
                {showPass ? "" : "👁"}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Re-enter password min. 6 characters"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form> 
        

        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
