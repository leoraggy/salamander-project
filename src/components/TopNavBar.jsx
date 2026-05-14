import { Link } from "react-router-dom";

function TopNavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/videos">Videos</Link>
    </nav>
  );
}

export default TopNavBar;
