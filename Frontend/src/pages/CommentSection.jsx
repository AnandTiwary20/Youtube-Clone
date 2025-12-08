import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import "../styles/CommentSection.css";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Load comments whenever videoId changes
  useEffect(() => {
    if (videoId) loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await API.get(`/comments/${videoId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  /* ========== ADD COMMENT ========== */
  const addComment = async () => {
    if (!text.trim()) return;
    try {
      await API.post(`/comments/${videoId}`, { text });
      setText("");
      loadComments();
    } catch (err) {
      alert(err.response?.data?.error || "Login required to comment");
    }
  };

  /* ========== START EDITING COMMENT ========== */
  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text);
  };

  /* ========== SAVE EDITED COMMENT ========== */
  const saveEdit = async () => {
    if (!editingText.trim()) return;
    try {
  await API.put(`/comments/${editingId}`, { text: editingText });
      setEditingId(null);
      setEditingText("");
      loadComments();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating comment");
    }
  };

  /* ========== CANCEL EDIT ========== */
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  /* ========== DELETE COMMENT ========== */
  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${id}`);
      loadComments();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting comment");
    }
  };

  return (
    <div className="comments-section">
      <h3>{comments.length} Comments</h3>

      {/* Add comment box */}
      <div className="add-comment">
        <input
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addComment}>Comment</button>
      </div>

      {/* Comments list */}
      {comments.map((c) => (
        <div key={c._id} className="comment-item">
<img className="comment-avatar" 
   src={c.user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
 />

          <div className="comment-header">
            
            <span className="comment-user">{c.user?.username || "User"}</span>
            <span className="comment-date">
              {new Date(c.createdAt).toLocaleDateString()}
              {c.isEdited && " · edited"}
            </span>
          </div>

          {/* VIEW MODE */}
          {editingId !== c._id && (
            <>
              <p className="comment-text">{c.text}</p>
              <div className="comment-actions">
                <button onClick={() => startEdit(c)}>✏ Edit</button>
                <button onClick={() => deleteComment(c._id)}>🗑 Delete</button>
              </div>
            </>
          )}

          {/* EDIT MODE */}
          {editingId === c._id && (
            <div className="edit-box">
              <input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
