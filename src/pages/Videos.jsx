import { useEffect, useState } from "react";
import { getVideos } from "../mockApi.js";
import { Link } from "react-router-dom";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      const video = await getVideos();
      setVideos(video);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Could not load videos: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-center">Available Videos</h1>
      <ul className="flex justify-center">
        {videos.map((filename) => (
          <li
            className="bg-orange-300 text-white p-4 rounded-md"
            key={filename}
          >
            <Link to={`preview/${filename}`}>{filename}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
