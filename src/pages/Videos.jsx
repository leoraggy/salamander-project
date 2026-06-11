import { useEffect, useState } from "react";
import { getVideos } from "../api";
import { Link } from "react-router-dom";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sanitizeFileName = (fileName) => {
    const index = fileName.indexOf(".");
    fileName = fileName.substring(0, index);
    return fileName;
  };

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

  {
    error && <div className="text-center text-red-500 m-2">Error: {error}</div>;
  }

  return (
    <div className="m-10">
      <h1 className="justify-self-center text-center font-bold m-2 text-green-600 w-auto text-2xl">
        List of Videos
      </h1>
      <ul className="flex justify-center space-x-2">
        {videos.map((filename) => (
          <Link to={`/preview/${filename}`}>
            <li
              className="text-center bg-orange-300 hover:bg-orange-400 text-white p-6 rounded-md"
              key={filename}
            >
              {sanitizeFileName(filename)}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
