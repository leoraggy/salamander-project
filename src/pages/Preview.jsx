import { Link, useParams } from "react-router-dom";
import { getThumbnail } from "../mockApi";
import { useRef, useState, useEffect } from "react";

export default function Preview() {
  const { filename } = useParams();

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [color, setColor] = useState("#000000");
  const [tolerance, setTolerance] = useState(150);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imageReady, setImageReady] = useState(false);

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
  }, [filename]);

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

    // draw original image
    ctx.drawImage(img, 0, 0);

    // get all pixel data from canvas
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;

    // convert selected hex color into RGB
    const targetRed = parseInt(color.slice(1, 3), 16);
    const targetGreen = parseInt(color.slice(3, 5), 16);
    const targetBlue = parseInt(color.slice(5, 7), 16);

    // loop through every pixel
    for (let i = 0; i < px.length; i += 4) {
      const red = px[i];
      const green = px[i + 1];
      const blue = px[i + 2];

      // Euclidean color distance
      const distance = Math.sqrt(
        (red - targetRed) ** 2 +
          (green - targetGreen) ** 2 +
          (blue - targetBlue) ** 2,
      );

      // binarize pixel
      if (distance < tolerance) {
        // white pixel
        px[i] = 255;
        px[i + 1] = 255;
        px[i + 2] = 255;
      } else {
        // black pixel
        px[i] = 0;
        px[i + 1] = 0;
        px[i + 2] = 0;
      }

      // leave alpha channel alone
    }

    // push modified pixels back onto canvas
    ctx.putImageData(data, 0, 0);
  }, [imageReady, color, tolerance]);

  return (
    <div>
      <div className="justify-self-center text-center font-medium pl-2 pr-2 m-2 bg-green-600 text-white w-auto rounded-sm">
        <Link to="/videos">Back to videos ↩</Link>
      </div>
      <div className="flex justify-center space-x-8">
        <div className="text-center bg-orange-300 text-white p-5 rounded-md">
          <img
            src={thumbnail}
            alt="image of salamander"
            className="w-previewSize h-previewSize"
          />
          {filename}
          {/* <p>
        Thumbnail and tuning controls will go here in a future pair program.
      </p> */}
          <br />
          Before Video
        </div>
        <div className="text-center bg-orange-300 text-white p-5 rounded-md">
          <canvas ref={canvasRef} className="w-previewSize h-previewSize" />
          {filename}
          <br />
          After Video
        </div>
      </div>
      <div className="justify-self-center text-center font-medium pl-2 pr-2 m-2 bg-green-600 text-white w-auto rounded-sm">
        Color
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
        ></input>
        Tolerance: {tolerance}
        <input
          type="range"
          min={"0"}
          max={"441"}
          value={tolerance}
          onChange={(e) => {
            setTolerance(Number(e.target.value));
          }}
        ></input>
      </div>
    </div>
  );
}
