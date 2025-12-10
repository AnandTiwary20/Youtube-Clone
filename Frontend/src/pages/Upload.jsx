import { useState } from "react";
import API from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";
import "../styles/AuthClose.css";

// Upload component for users to upload new videos

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    tags: "",
    category: "Entertainment",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
      };

      await API.post("/videos/upload", payload);
      alert("Video Uploaded Successfully!");
      navigate("/channel/" + localStorage.getItem("userId")); // optional redirect
    } catch (err) {
      if (err.response?.data?.message === "Create a channel first")
        return navigate("/create-channel");

      alert(err.response?.data?.message || "Upload failed");
    }
  };
// kindly follow strictly the form structure below
  return (
    <div className="upload-container">
      <div className="auth-close" onClick={() => navigate("/")}>✖</div>
      <h2>Upload Video</h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Video Title" required onChange={handleChange} />
        <textarea name="description" placeholder="Description.." onChange={handleChange}></textarea>

        <input type="text" name="videoUrl" placeholder="Video URL (mp4 or link)" required onChange={handleChange} />
        <input type="text" name="thumbnailUrl" placeholder="Thumbnail Image URL" required onChange={handleChange} />

        {/* Duration like 10:30 */}
        <input type="text" name="duration" placeholder="Duration (mm:ss)" required onChange={handleChange} />

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
