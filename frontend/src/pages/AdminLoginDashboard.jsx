import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import './AdminLoginDashboard.css';

const AdminLoginDashboard = () => {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState(null);
  const [counts, setCounts] = useState({
    users: 0,
    providers: 0,
    flyers: 0,
    pending_flyers: 0,
  });
  const [serverStatus, setServerStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/');

    const headers = { Authorization: `Token ${token}` };

    const fetchData = async () => {
      try {
        const [meRes, countsRes, statusRes] = await Promise.all([
          axios.get(`${BASE_URL}api/accounts/me/`, { headers }),
          axios.get(`${BASE_URL}api/dashboard-counts/`, { headers }),
          axios.get(`${BASE_URL}api/accounts/server-status/`, { headers }),
        ]);

        setAdminData(meRes.data);
        setCounts({
          users: countsRes.data.users,
          providers: countsRes.data.providers,
          flyers: countsRes.data.flyers,
          pending_flyers: countsRes.data.pending_flyers,
        });
        setServerStatus(statusRes.data.status === 'online' ? 'Online' : 'Offline');
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        alert('Session expired or failed to load data.');
        localStorage.removeItem('adminToken');
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6b6b'];

  const barChartData = [
    { name: 'Users', count: counts.users },
    { name: 'Providers', count: counts.providers },
    { name: 'Brochures', count: counts.flyers },
    { name: 'Pending', count: counts.pending_flyers },
  ];

  const pieChartData = [
    { name: 'Users', value: counts.users },
    { name: 'Providers', value: counts.providers },
  ];

  if (isLoading) return <div className="dashboard-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      

      <div className="cards-container">
        {barChartData.map((card, i) => (
          <div key={card.name} className="stat-card" style={{ borderColor: COLORS[i % COLORS.length] }}>
            <h4>{card.name}</h4>
            <p>{card.count}</p>
          </div>
        ))}
      </div>

      <div className="charts-wrapper">
        <div className="chart-box">
          <h3>📈 Brochure Stats</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>👥 User Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%" outerRadius={100}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-notes">
        <h3>🧾 System Summary</h3>
        <p><strong>Admin:</strong> {adminData?.full_name}</p>
        <p><strong>Last login:</strong> {formatDateTime(adminData?.last_login)}</p>
        <p><strong>Server status:</strong> {serverStatus === 'Online' ? '✅ Online' : '❌ Offline'}</p>
      </div>
    </div>
  );
};

export default AdminLoginDashboard;