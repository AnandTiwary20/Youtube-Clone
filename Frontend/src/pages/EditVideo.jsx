import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import "../styles/EditVideo.css";

export default function EditVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    tags: "",
    category: "",
  });

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    const res = await API.get(`/videos/${id}`);
    setForm({
      title: res.data.title,
      description: res.data.description,
      thumbnailUrl: res.data.thumbnailUrl,
      tags: res.data.tags?.join(", "),
      category: res.data.category,
    });
  };

  const updateVideo = async () => {
    await API.put(`/videos/${id}`, {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()),
    });
    alert("Video updated successfully");
    navigate(`/video/${id}`);
  };

  return (
    <div className="edit-video-container">
      <h2>Edit Video</h2>

      <input 
        value={form.title} 
        onChange={(e)=>setForm({...form,title:e.target.value})} 
        placeholder="Title" 
      />

      <textarea
        value={form.description}
        onChange={(e)=>setForm({...form,description:e.target.value})}
        placeholder="Description"
      />

      <input 
        value={form.thumbnailUrl} 
        onChange={(e)=>setForm({...form,thumbnailUrl:e.target.value})}
        placeholder="Thumbnail URL" 
      />

      <input 
        value={form.tags} 
        onChange={(e)=>setForm({...form,tags:e.target.value})}
        placeholder="Tags (comma separated)" 
      />

      <input 
        value={form.category} 
        onChange={(e)=>setForm({...form,category:e.target.value})}
        placeholder="Category" 
      />

      <button onClick={updateVideo}>Update</button>
    </div>
  );
}
