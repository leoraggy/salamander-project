import { Link, useParams } from "react-router-dom";
import { getThumbnail } from "../mockApi";
import { useState, useEffect } from "react";

export default function Preview() {
  const { filename } = useParams();

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThumbnail = async () => {
    try {
      const data = await getThumbnail(filename);
      setThumbnail(data);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThumbnail();
  }, []);

  return (
    <div>
      <div className="justify-self-center text-center font-medium pl-2 pr-2 m-2 bg-green-600 text-white w-auto rounded-sm">
        Preview: <img src={thumbnail} alt="image of salamander" />
        {filename}
        {/* <p>
        Thumbnail and tuning controls will go here in a future pair program.
      </p> */}
        <Link to="/videos">Back to videos</Link>
      </div>
      <div className="flex justify-center space-x-8">
        <div className="text-center bg-orange-300 text-white p-30 rounded-md">
          Before Video
        </div>
        <div className="text-center bg-orange-300 text-white p-30 rounded-md">
          After Video
        </div>
      </div>
    </div>
  );
}
