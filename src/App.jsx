import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import Preview from "./pages/Preview";
import TopNavBar from "./components/TopNavBar";
import Footer from "./components/Footer";
import JobStatus from "./pages/JobStatus";
import ExcelChart from "./pages/ExcelChart";
export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar />

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/preview/:filename" element={<Preview />} />
          <Route path="/status/:jobId" element={<JobStatus />} />
          <Route path="/charts" element={<ExcelChart />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
