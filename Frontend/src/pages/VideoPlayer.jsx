import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import "../styles/VideoPlayer.css";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchVideo();
    fetchRecommended();
    fetchComments();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await API.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (e) {
      console.log("Video load failed");
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await API.get("/videos?limit=25");
      setRecommended(res.data.videos || []);
    } catch {}
  };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${id}`);
      setComments(res.data);
    } catch {}
  };

  /* LIKE VIDEO */
  const likeVideo = async () => {
    await API.put(`/videos/like/${id}`);
    fetchVideo();
  };

  /* DISLIKE VIDEO */
  const dislikeVideo = async () => {
    await API.put(`/videos/dislike/${id}`);
    fetchVideo();
  };

  /* POST COMMENT */
  const postComment = async () => {
    if (!commentText.trim()) return;
    try {
      await API.post(`/comments/${id}`, { text: commentText });
      setCommentText("");
      fetchComments();
    } catch {
      alert("Please login to comment");
    }
  };

  if (!video) return <h2 className="loader">Loading video...</h2>;

  return (
    <div className="video-page">

      {/* ----------- LEFT MAIN PLAYER ----------- */}
      <div className="video-left">

        <video className="video-player" controls autoPlay src={video.videoUrl} poster={video.thumbnailUrl} />

        <h2 className="video-title">{video.title}</h2>

        <div className="video-info-row">
          <span>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</span>

          <div className="action-buttons">
            <button onClick={likeVideo}>👍 {video.likes?.length}</button>
            <button onClick={dislikeVideo}>👎 {video.dislikes?.length}</button>
            <button>⤴ Share</button>
          </div>
        </div>

        {/* CHANNEL BOX */}
        <div className="channel-box">
          <img className="channel-avatar" src={video.channel?.avatar} />

          <div>
            <h4>{video.channel?.channelName}</h4>
            <p className="sub-count">{video.uploader?.username}</p>
          </div>

          <button className="subscribe-btn">Subscribe</button>
        </div>

        <div className="description-box">{video.description}</div>

        {/* -------- COMMENTS -------- */}
        <div className="comments-section">

          <h3>Comments ({comments.length})</h3>

          <div className="add-comment">
            <input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={postComment}>Post</button>
          </div>

          {comments.map((c) => (
            <div key={c._id} className="comment-item">
              <b>{c.user?.username}</b>
              <p>{c.text}</p>
              <small>{new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
          ))}

        </div>
      </div>


      {/* ----------- RIGHT | RECOMMENDED ---------- */}
      <div className="recommended-box">
        <h3 className="rec-title">Recommended</h3>

        {recommended.filter(v => v._id !== id).map(v => (
          <div key={v._id} onClick={() => window.location = `/video/${v._id}`} className="rec-item">
            <img src={v.thumbnailUrl} />

            <div className="rec-info">
              <p className="rec-name">{v.title}</p>
              <p className="rec-channel">{v.channel?.channelName}</p>
              <span className="rec-views">{v.views} views</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
