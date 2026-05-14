import { Link, useParams } from "react-router-dom";

export default function Preview() {
  const { filename } = useParams();

  return (
    <div>
      <div className="justify-self-center text-center font-medium pl-2 pr-2 m-2 bg-green-600 text-white w-auto rounded-sm">
        <h1>Preview: {filename}</h1>
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
