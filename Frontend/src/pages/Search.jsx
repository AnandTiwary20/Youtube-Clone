import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import API from "../utils/axiosInstance";
import "../styles/Search.css";

export default function Search() {
  const query = new URLSearchParams(useLocation().search).get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) fetchResults();
  }, [query]);

  const fetchResults = async () => {
    try {
      const res = await API.get(`/videos/search?q=${query}`);
      setResults(res.data.videos || res.data);
    } catch (e) {
      console.log("Search error", e);
    }
  };

  return (
    <div className="search-page">
      <h2 className="search-heading">Search results for: <span>{query}</span></h2>

      {results.length === 0 && <p className="no-result">No videos found.</p>}

      <div className="search-grid">
        {results.map(video => (
          <Link to={`/video/${video._id}`} className="search-card" key={video._id}>
            <img src={video.thumbnailUrl} className="thumb" />
            <div className="info">
              <h3>{video.title}</h3>
              <p>{video.channel?.channelName}</p>
              <small>{video.views} views</small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
