import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await axios.get(`/api/videos/${id}`);
        // setVideo(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setVideo({
            id,
            title: 'Sample Video Title',
            description: 'This is a sample video description.',
            url: 'https://www.example.com/sample-video.mp4',
            thumbnail: 'https://via.placeholder.com/1280x720',
            views: 1000,
            likes: 100,
            uploadDate: '2023-01-01',
            channel: {
              id: 'channel1',
              name: 'Sample Channel',
              avatar: 'https://via.placeholder.com/50',
              subscribers: 1000,
            },
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load video');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <div className="p-4">Loading video...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!video) return <div className="p-4">Video not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
        <video
          src={video.url}
          controls
          className="w-full h-full"
          poster={video.thumbnail}
        />
      </div>
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <div className="flex items-center mt-2">
          <img
            src={video.channel.avatar}
            alt={video.channel.name}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <h3 className="font-medium">{video.channel.name}</h3>
            <p className="text-sm text-gray-500">
              {video.channel.subscribers.toLocaleString()} subscribers
            </p>
          </div>
          <button className="ml-auto bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Subscribe
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex space-x-4 text-sm text-gray-600 mb-2">
            <span>{video.views.toLocaleString()} views</span>
            <span>{video.likes} likes</span>
            <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
          </div>
          <p className="whitespace-pre-line">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;