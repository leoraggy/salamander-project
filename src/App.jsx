import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import Preview from "./pages/Preview";
import TopNavBar from "./components/TopNavBar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <TopNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/preview/:filename" element={<Preview />} />
      </Routes>
      <Footer />
    </>
  );
}
