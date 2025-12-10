import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";       
import "../styles/EditVideo.css";
// EditVideo component to allow users to edit their uploaded videos
// APi calls to fetch and update video details
export default function EditVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: "",
    tags: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
  }, [id]);
// Fetch video details to pre-fill the form
  const fetchVideo = async () => {
    try {
      const res = await API.get(`/videos/${id}`);
      setForm({
        title: res.data.title,
        description: res.data.description,
        thumbnailUrl: res.data.thumbnailUrl,
        videoUrl: res.data.videoUrl,
        category: res.data.category,
        tags: res.data.tags?.join(", ") || ""
      });
      setLoading(false);
    } catch {
      alert("Video not found");
      navigate("/channel/me");
    }
  };
  // Handle form input changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
// update video details 
  const updateVideo = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/videos/${id}`, {
        ...form,
        tags: form.tags.split(",").map(t => t.trim())
      });

      alert("Video updated successfully!");
      navigate(`/watch/${id}`);
  
    } catch (err) {
   if (err.response?.status === 403) 
     return alert("You can only edit your own videos!");
   alert(err.response?.data?.message || "Update failed");
}
  };
// loading state
  if (loading) return <h2 className="loader">Loading...</h2>;
//  Render the edit video form
  return (
    <div className="edit-video-container">

      <h2>Edit Video</h2>

      <form onSubmit={updateVideo} className="edit-video-form">
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows="4" />

        <input type="text" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" required />

        <input type="text" name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="Video URL" required />

        <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />

        <select name="category" value={form.category} onChange={handleChange}>
          <option>Entertainment</option>
          <option>Tech</option>
          <option>Music</option>
          <option>Education</option>
          <option>Gaming</option>
        </select>

        <button className="save-btn">Save Changes</button>
      </form>

    </div>
  );
}
