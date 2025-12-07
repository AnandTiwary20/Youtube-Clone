import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../utils/axiosInstance";          
import { useDispatch } from "react-redux";        
import { loginSuccess } from "../store/authSlice"; 
import "../styles/Login.css";   // ⭐ Important new CSS file we'll create

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", formData);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
        <div className="auth-close" onClick={() => navigate("/")}>✖</div>
      <div className="login-box">

        <h2 className="login-title">Welcome Back</h2>
        <p className="subtitle">Sign in to continue watching</p>

        <form onSubmit={handleSubmit}>
        

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} required />
          </div>

          <button type="submit" className="login-btn">{loading ? "Loading..." : "Login"}</button>
        </form>

        <p className="register-link">
          New here? <span onClick={() => navigate("/register")}>Create an account</span>
        </p>
      </div>
    </div>
  );
}
