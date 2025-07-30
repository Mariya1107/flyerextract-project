import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import BASE_URL from '../config';
import './AdminLoginDashboard.css'; // Reuse existing styling

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6b6b', '#a29bfe'];

const AdminStats = () => {
  const [flyers, setFlyers] = useState([]);
  const [products, setProducts] = useState([]);
  const [flyerCountsPerStore, setFlyerCountsPerStore] = useState([]);
  const [monthlyUploads, setMonthlyUploads] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}flyers/all/`)
      .then(res => {
        setFlyers(res.data);

        // Generate dummy monthly data (you can adjust based on real backend if available)
        const monthly = Array.from({ length: 6 }).map((_, i) => ({
          month: `Month ${i + 1}`,
          uploads: Math.floor(Math.random() * 20 + 5),
        }));
        setMonthlyUploads(monthly);

        // Store-based stats
        const counts = {};
        res.data.forEach(f => {
          const name = f.store_name || 'Unknown';
          counts[name] = (counts[name] || 0) + 1;
        });
        const pieData = Object.entries(counts).map(([name, value]) => ({ name, value }));
        setFlyerCountsPerStore(pieData);
      });

    axios.get(`${BASE_URL}products/all/`)
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="main-content1">
      <h2>📊 Admin Statistics</h2>

      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Flyers</h4>
            <p>{flyers.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Products</h4>
            <p>{products.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Stores</h4>
            <p>{flyerCountsPerStore.length}</p>
          </div>
        </div>
      </div>

      <div className="stat-cards-grid">
        {/* Bar Chart: Flyers per Store */}
        <div className="stat-card" style={{ minHeight: '300px' }}>
          <h4>Flyers per Store</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={flyerCountsPerStore}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Monthly Uploads */}
        <div className="stat-card" style={{ minHeight: '300px' }}>
          <h4>Monthly Flyer Uploads</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyUploads}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="uploads" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Flyer distribution */}
      <div className="stat-card" style={{ marginTop: '30px', minHeight: '300px' }}>
        <h4>Flyer Distribution by Store</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={flyerCountsPerStore} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {flyerCountsPerStore.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStats;
