import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function JobStatusScreen() {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobStatus = async () => {
    try {
      // Points to: GET /api/process/{jobId}/status
      const response = await fetch(`/api/process/${jobId}/status`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setJobData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobStatus();

    const interval = setInterval(() => {
      // Stop polling if status matches what your Java backend emits: "done" or "error"
      if (
        jobData &&
        (jobData.status === "done" || jobData.status === "error")
      ) {
        clearInterval(interval);
      } else {
        fetchJobStatus();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, jobData?.status]);

  if (loading)
    return (
      <div className="text-center p-10 text-white">Checking status...</div>
    );
  if (error)
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-slate-800 text-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Processing Status</h2>
      <p className="text-sm text-gray-400 mb-6">
        Job ID: <span className="font-mono text-yellow-400">{jobId}</span>
      </p>

      {jobData && (
        <div className="space-y-6">
          {/* Status Badge */}
          <div>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold uppercase ${
                jobData.status === "done"
                  ? "bg-green-600"
                  : jobData.status === "error"
                    ? "bg-red-600"
                    : "bg-blue-600 animate-pulse"
              }`}
            >
              {jobData.status}
            </span>
          </div>

          {/* Conditional Layout adjustments when completed */}
          {jobData.status === "done" && (
            <div className="mt-6 p-4 bg-slate-700 rounded border border-green-500">
              <p className="text-green-400 font-medium mb-3">
                ✨ Data parsing complete!
              </p>

              {/* Direct Native Link targeting the new Java controller endpoint */}
              <a
                href={`/api/process/${jobId}/download`}
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded font-bold transition-colors shadow-sm"
              >
                📥 Download Results CSV
              </a>
            </div>
          )}

          {jobData.status === "error" && (
            <p className="text-red-400 text-sm mt-2">
              {jobData.errorMessage ||
                "An internal error occurred during compute execution."}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-slate-700">
        <Link to="/videos" className="text-blue-400 hover:underline text-sm">
          ← Back to Videos
        </Link>
      </div>
    </div>
  );
}
