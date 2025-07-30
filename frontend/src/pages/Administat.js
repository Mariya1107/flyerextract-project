// AdminStats.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register components with Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data (replace with real API/fetch data later)
const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Provider Signups",
      data: [3, 7, 12, 20, 28, 35, 45],
      borderColor: "#7f5af0",
      backgroundColor: "#c8bcff",
      tension: 0.3,
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Monthly Provider Growth" },
  },
};

const AdminStats = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Admin Dashboard</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AdminStats;
