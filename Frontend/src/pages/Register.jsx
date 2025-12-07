import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import "../styles/Register.css";  // make sure this file is created

export default function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword)
      return alert("Passwords do not match ❌");

    try {
      setLoading(true);
      const res = await API.post("/auth/register", formData);
      dispatch(loginSuccess(res.data));
      alert("Account created successfully 🎉");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="auth-close" onClick={() => navigate("/")}>✖</div>

      <div className="register-box">

        <h2 className="title">Create Account</h2>
        <p className="subtitle">Join the platform & start uploading videos</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required/>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
          </div>

          <button type="submit" className="register-btn">
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
