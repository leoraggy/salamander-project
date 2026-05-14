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
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p>Could not load videos: {error}</p>;
  }

  return (
    <div className="m-10">
      <h1 className="justify-self-center text-center font-medium pl-2 pr-2 m-2 bg-green-600 text-white w-auto rounded-sm">
        Available Videos
      </h1>
      <ul className="flex justify-center space-x-2">
        {videos.map((filename) => (
          <li
            className="text-center bg-orange-300 text-white p-6 rounded-md"
            key={filename}
          >
            <Link to={`preview/${filename}`}>{filename}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
