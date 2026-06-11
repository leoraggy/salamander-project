import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold  text-orange-400 text-center mt-2">
        Salamander Tracker
      </h1>
      <p className="text-center mx-10 px-20">
        Salamander Tracker is a project dedicated to tracking the location of
        salamander through video. You upload a video and the API will track the
        salamander. It will export an excel file of its locations every minute.
      </p>
      <div class="grid place-items-center h-32 text-2xl font-bold mt-10">
        <p>Check out the list of videos!</p>
        <Link to="/videos">
          <div className="bg-orange-400 py-3 px-5 rounded-lg mr-2 hover:bg-orange-500">
            <p className="text-white text-2xl font-bold">Videos</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
