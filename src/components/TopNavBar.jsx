import { Link } from "react-router-dom";

function TopNavBar() {
  return (
    <nav className="flex justify-between  items-center p-5 bg-green-600">
      <div>
        <Link to="/" className="flex">
          <img src="./logo.png" alt="Logo of Salamander" width={75} />
          <p className="flex justify-center items-center text-white text-2xl pl-2 font-bold  hover:text-orange-400">
            Salamander Project
          </p>
        </Link>
      </div>
      <Link to="/videos">
        <div className="bg-orange-400 py-3 px-5 rounded-lg mr-2 hover:bg-orange-500">
          <p className="text-white text-2xl font-bold">Videos</p>
        </div>
      </Link>
    </nav>
  );
}

export default TopNavBar;
