import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobStatus } from "../api";

export default function JobStatusScreen() {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobStatus = async () => {
    try {
      const data = await getJobStatus(jobId);
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
      <div className="text-center p-10 text-emerald-700 font-medium">
        Checking status...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-600 font-medium">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white text-gray-800 rounded-xl border border-gray-100 shadow-lg text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Processing Status
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Job ID:{" "}
        <span className="font-mono text-green-600 font-semibold">{jobId}</span>
      </p>

      {jobData && (
        <div className="space-y-6">
          <div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                jobData.status === "done"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : jobData.status === "error"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
              }`}
            >
              {jobData.status}
            </span>
          </div>

          {jobData.status === "done" && (
            <div className="mt-6 p-5 bg-green-600 rounded-lg border border-emerald-200">
              <p className="text-white font-semibold mb-4">
                Data parsing complete!
              </p>

              <a
                href={`/api/process/${jobId}/download`}
                className="inline-block bg-orange-400 hover:bg-orange-500 text-white px-5 py-2.5 rounded-md font-bold transition-colors shadow-sm"
              >
                📥 Download CSV
              </a>
            </div>
          )}

          {jobData.status === "error" && (
            <p className="text-red-600 text-sm mt-2 font-medium">
              {jobData.errorMessage ||
                "An internal error occurred during compute execution."}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-gray-100">
        <Link
          to="/videos"
          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors hover:underline"
        >
          ← Back to Videos
        </Link>
      </div>
    </div>
  );
}
