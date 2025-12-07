import { useState } from "react";
import API from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";
import "../styles/AuthClose.css";


export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    tags: "",
    category: "Entertainment"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/videos/upload", {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim())
      });

      alert("Video Uploaded Successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (

    
    
    <div className="upload-container">
      <div className="auth-close" onClick={() => navigate("/")}>✖</div>
      <h2>Upload Video</h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Video Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description..." onChange={handleChange}></textarea>

        <input type="text" name="videoUrl" placeholder="Video URL (mp4 / youtube link)" onChange={handleChange} required />
        <input type="text" name="thumbnailUrl" placeholder="Thumbnail Image URL" onChange={handleChange} required />
        <input type="number" name="duration" placeholder="Duration in seconds" onChange={handleChange} required />

        <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
        
        <select name="category" onChange={handleChange}>
          <option>Entertainment</option>
          <option>Tech</option>
          <option>Education</option>
          <option>Gaming</option>
          <option>Music</option>
        </select>

        <button type="submit" className="upload-btn">Upload</button>
      </form>
    </div>
  );
}
