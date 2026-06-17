import React, { useState } from "react";
import Papa from "papaparse";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CsvChartApp() {
  const [chartData, setChartData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const formattedData = results.data.map((item, index) => ({
          ...item,
          id: index,
        }));
        setChartData(formattedData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  return (
    <div className="p-5 font-sans w-full">
      <div className="mb-7">
        <label
          htmlFor="csv-upload"
          className="inline-block px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200"
        >
          Upload CSV File
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {chartData.length > 0 && (
        <div className="w-full min-w-0">
          <h3 className="m-0 mb-5 text-gray-900 text-lg font-semibold">
            Centroid X-Coordinate Trend
          </h3>

          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 15, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />

                <XAxis
                  dataKey="id"
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  label={{
                    value: "Step Sequence",
                    position: "insideBottom",
                    offset: -12,
                    style: { fill: "#4b5563", fontSize: 13, fontWeight: 500 },
                  }}
                />

                <YAxis
                  domain={["auto", "auto"]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  label={{
                    value: "X Coordinate Value",
                    angle: -90,
                    position: "insideLeft",
                    offset: -5,
                    style: {
                      fill: "#4b5563",
                      fontSize: 13,
                      fontWeight: 500,
                      textAnchor: "middle",
                    },
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={40}
                  align="right"
                  iconType="circle"
                />

                <Area
                  type="monotone"
                  dataKey="centroid_x"
                  name="Centroid X"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorX)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#f43f5e" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default CsvChartApp;
