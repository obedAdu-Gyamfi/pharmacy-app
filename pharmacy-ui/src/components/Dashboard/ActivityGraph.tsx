import { useState, useEffect } from "react";
import axios from "axios";
import { FiUser } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const ActivityGraph = () => {
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/recent-activity");
        setActivityData(res.data);
      } catch (err) {
        console.error("Failed to fetch activity data:", err);
      }
    };

    fetchActivity();
  }, []);

  if (!activityData.length) return <div>Loading activity graph...</div>;

  return (
    <div className="col-span-8 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiUser /> Activity
        </h3>
      </div>
      <LineChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        data={activityData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="No. Sales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Sales" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
};
