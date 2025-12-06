import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sampleVideos } from "../data/sampleVideos";

const ChannelPage = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setTimeout(() => {
          setChannel({
            id,
            name: 'Sample Channel',
            description: 'This is a sample channel description. Subscribe for more content!',
            avatar: 'https://via.placeholder.com/100',
            banner: 'https://via.placeholder.com/1200x200',
            subscribers: 1000,
            joinDate: '2022-01-01',
          });

          // Set sample videos imported from dummy JSON
          setVideos(sampleVideos);

          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load channel');
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  if (loading) return <div className="p-4">Loading channel...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!channel) return <div className="p-4">Channel not found</div>;

  return (
    <div>
      {/* Channel Banner */}
      <div 
        className="h-48 bg-gray-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${channel.banner})` }}
      ></div>
      
      {/* Channel Info */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-start">
          <img
            src={channel.avatar}
            alt={channel.name}
            className="w-24 h-24 rounded-full -mt-12 border-4 border-white"
          />
          <div className="ml-6 flex-1">
            <h1 className="text-2xl font-bold">{channel.name}</h1>
            <p className="text-gray-600">@{channel.name.toLowerCase().replace(/\s+/g, '')}</p>
            <p className="mt-2 text-gray-700">{channel.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>{channel.subscribers.toLocaleString()} subscribers</span>
              <span className="mx-2">•</span>
              <span>Joined {new Date(channel.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            Subscribe
          </button>
        </div>

        {/* Videos Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Uploads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Link
                key={video.videoId}
                to={`/video/${video.videoId}`}
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-auto rounded-lg"
                  />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {video.duration || "10:00"}
                  </span>
                </div>

                <h3 className="font-medium mt-2 line-clamp-2">{video.title}</h3>

                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <span>{video.views.toLocaleString()} views</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
