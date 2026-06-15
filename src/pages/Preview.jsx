import { Link, useParams } from "react-router-dom";
import { getThumbnail, postProcessingJob } from "../api";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function findLargestGroup(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  let largestGroup = null;

  function dfs(startRow, startCol, stats) {
    const stack = [[startRow, startCol]];

    while (stack.length > 0) {
      const [row, col] = stack.pop();

      if (
        row < 0 ||
        col < 0 ||
        row >= rows ||
        col >= cols ||
        grid[row][col] === 0
      ) {
        continue;
      }

      grid[row][col] = 0;

      stats.size++;
      stats.xSum += col;
      stats.ySum += row;

      stack.push([row - 1, col]);
      stack.push([row + 1, col]);
      stack.push([row, col - 1]);
      stack.push([row, col + 1]);
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        const stats = {
          size: 0,
          xSum: 0,
          ySum: 0,
        };

        dfs(row, col, stats);

        if (!largestGroup || stats.size > largestGroup.size) {
          largestGroup = {
            size: stats.size,
            centroidX: Math.floor(stats.xSum / stats.size),
            centroidY: Math.floor(stats.ySum / stats.size),
          };
        }
      }
    }
  }

  return largestGroup;
}

export default function Preview() {
  const { filename } = useParams();

  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [color, setColor] = useState("#000000");
  const [threshold, setThreshold] = useState(150); // Renamed from tolerance

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imageReady, setImageReady] = useState(false);

  const fetchThumbnail = async () => {
    try {
      const image = await getThumbnail(filename);
      setThumbnail(image);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThumbnail();
  }, [filename]);

  // debounce useEffect
  const [debouncedThreshold, setDebouncedThreshold] = useState(threshold);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedThreshold(threshold);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [threshold]);

  useEffect(() => {
    if (!thumbnail) return;
    setImageReady(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageReady(true);
      console.log(
        "image loaded:",
        imgRef.current.naturalWidth,
        "x",
        imgRef.current.naturalHeight,
      );
    };
    img.src = thumbnail;
  }, [thumbnail]);

  useEffect(() => {
    if (!imageReady) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;

    const targetRed = parseInt(color.slice(1, 3), 16);
    const targetGreen = parseInt(color.slice(3, 5), 16);
    const targetBlue = parseInt(color.slice(5, 7), 16);

    const binaryGrid = [];

    for (let y = 0; y < canvas.height; y++) {
      binaryGrid[y] = [];

      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;

        const red = px[index];
        const green = px[index + 1];
        const blue = px[index + 2];

        const distance = Math.sqrt(
          (red - targetRed) ** 2 +
            (green - targetGreen) ** 2 +
            (blue - targetBlue) ** 2,
        );

        if (distance < debouncedThreshold) {
          px[index] = 255;
          px[index + 1] = 255;
          px[index + 2] = 255;

          binaryGrid[y][x] = 1;
        } else {
          px[index] = 0;
          px[index + 1] = 0;
          px[index + 2] = 0;

          binaryGrid[y][x] = 0;
        }
      }
    }
    ctx.putImageData(data, 0, 0);

    const gridCopy = binaryGrid.map((row) => [...row]);

    const largestGroup = findLargestGroup(gridCopy);

    console.log(largestGroup);
    if (largestGroup) {
      ctx.beginPath();
      ctx.arc(
        largestGroup.centroidX,
        largestGroup.centroidY,
        8,
        0,
        Math.PI * 2,
      );

      ctx.fillStyle = "red";
      ctx.fill();

      console.log(
        "Largest group:",
        largestGroup.size,
        "Centroid:",
        largestGroup.centroidX,
        largestGroup.centroidY,
      );
    }
  }, [imageReady, color, debouncedThreshold]); // Dependency updated

  const handleSubmitJob = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      // Direct pass-through of threshold state to the API function
      const result = await postProcessingJob(filename, color, threshold);
      console.log("Job submitted successfully:", result);
      setSubmitStatus("success");
      if (result && result.jobId) {
        navigate(`/status/${result.jobId}`);
      }
    } catch (err) {
      console.error("Failed to submit job:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      <div className="justify-self-center text-center font-medium pl-2 pr-2 py-2 m-2 bg-green-600 hover:bg-green-700 text-white w-auto rounded-sm">
        <Link to="/videos">Back To Videos</Link>
      </div>

      {error && (
        <div className="text-center text-red-500 m-2">Error: {error}</div>
      )}

      <div className="flex justify-center space-x-8">
        <div className="text-center bg-orange-300 font-bold text-white pl-5 pr-5 pb-5 rounded-md">
          <p className="text-xl">Preview</p>
          <img
            src={thumbnail}
            alt="image of salamander"
            className="max-w-100 max-h-100 object-contain mx-auto"
          />
        </div>
        <div className="text-center bg-orange-300 font-bold text-white pl-5 pr-5 pb-5 rounded-md">
          <p className="text-xl">Centroid</p>
          <canvas
            ref={canvasRef}
            className="max-w-100 max-h-100 object-contain mx-auto"
          />
        </div>
      </div>

      <div className="justify-self-center text-center font-medium pl-2 pr-2 m-2 bg-green-600 text-white w-auto rounded-sm flex flex-col items-center gap-3 p-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="cursor-pointer"
            />
          </label>

          <label className="flex items-center gap-2">
            Threshold: {threshold}
            <input
              type="range"
              min="0"
              max="441"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="mt-2">
          <button
            onClick={handleSubmitJob}
            disabled={isSubmitting || !imageReady}
            className={`px-4 py-2 font-bold rounded shadow transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isSubmitting ? "Processing..." : "Begin Processing Job"}
          </button>

          {submitStatus === "success" && (
            <p className="text-sm text-green-200 mt-1">
              Job successfully started!
            </p>
          )}
          {submitStatus === "error" && (
            <p className="text-sm text-red-200 mt-1">
              Failed to start processing job.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
