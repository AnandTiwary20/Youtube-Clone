import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import "../styles/CreateChannel.css";
import "../styles/AuthClose.css";

// CreateChannel component for users to create a new channel


export default function CreateChannel() {
  const [form, setForm] = useState({
    channelName: "",
    description: "",
    bannerUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Handle form input changes

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // handle form submission to create channel

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // backend: POST /api/channels
      const res = await API.post("/channels", {
        channelName: form.channelName,
        description: form.description,
        channelBanner: form.bannerUrl,
      });

      alert("Channel created successfully!");

      // go to that channel page (adjust if your response shape differs)
      const channelId = res.data._id || res.data.channel?._id;
      if (channelId) {
        navigate(`/channel/${channelId}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Create channel error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };
  // Render the create channel form

  return (
    <div className="create-channel-page">
      <div className="create-channel-card">
        <h1 className="create-channel-title"> <i class="bi bi-bag-plus-fill"></i> Create your channel</h1>
        <p className="create-channel-subtitle">
          Set up your channel name and details. You can change these later.
        </p>

        {errorMsg && <div className="create-channel-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="create-channel-form">
          <div className="form-group">
            <label>Channel Name</label>
            <input
              type="text"
              name="channelName"
              value={form.channelName}
              onChange={handleChange}
              placeholder="My Awesome Channel"    //placeholder text
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what your channel is about..."
            />
          </div>
                {/* banner image */}
          <div className="form-group">
            <label>Banner Image URL (optional)</label>
            <input
              type="text"
              name="bannerUrl"
              value={form.bannerUrl}
              onChange={handleChange}
              placeholder="https://example.com/banner.png"
            />
          </div>
    {/* submit button */}
          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Creating..." : "Create Channel"}
          </button>
        </form>
      </div>
    </div>
  );
}
