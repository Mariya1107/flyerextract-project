import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import "./ProviderLoginDashboard.css";

const ProviderLoginDashboard = () => {
  const [counts, setCounts] = useState({
    brochures: 0,
    products: 0,
    providers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (!token) return;

    axios
      .get(`${BASE_URL}/api/provider-dashboard-counts/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setCounts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch provider dashboard stats", err);
      });
  }, []);

  const chartData = [
    { name: "Brochures", count: counts.brochures },
    { name: "Products", count: counts.products },
    { name: "Providers", count: counts.providers },
  ];

  return (
    <div className="dashboard-content">
      <div className="stat-cards-grid">
        <div className="stat-card">
          <h4>Brochures</h4>
          <p>{counts.brochures}</p>
        </div>
        <div className="stat-card">
          <h4>Products</h4>
          <p>{counts.products}</p>
        </div>
        <div className="stat-card">
          <h4>Providers</h4>
          <p>{counts.providers}</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h3>📊 Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>📈 Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      
    </div>
  );
};

export default ProviderLoginDashboard;
