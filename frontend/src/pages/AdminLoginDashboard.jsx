import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config';
import './AdminLoginDashboard.css';

const AdminLoginDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  const [usersCount, setUsersCount] = useState(0);
  const [providersCount, setProvidersCount] = useState(0);
  const [flyersCount, setFlyersCount] = useState(0);
  const [pendingFlyersCount, setPendingFlyersCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/');
      return;
    }

    const headers = { Authorization: `Token ${token}` };

    // Fetch admin info
    axios
      .get(`${BASE_URL}api/accounts/me/`, { headers })
      .then((res) => {
        setAdminData(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch admin info:', err);
        alert('Session expired or invalid token. Please log in again.');
        localStorage.removeItem('adminToken');
        navigate('/');
      });

    // Fetch dashboard counts
    axios
      .get(`${BASE_URL}api/dashboard-counts/`, { headers })
      .then((res) => {
        setUsersCount(res.data.users);
        setProvidersCount(res.data.providers);
        setFlyersCount(res.data.flyers);
        setPendingFlyersCount(res.data.pending_flyers);
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard counts:', err);
      });
  }, [navigate]);

  const adminCards = [
    { title: 'Total Users', value: usersCount, color: '#3b82f6' },
    { title: 'Active Providers', value: providersCount, color: '#10b981' },
    { title: 'Total Brochures', value: flyersCount, color: '#f59e0b' },
    { title: 'Pending Approvals', value: pendingFlyersCount, color: '#ef4444' },
  ];

  return (
    <div className="stat-cards-grid">
      {adminCards.map((card) => (
        <div key={card.title} className="stat-card">
          <div className="stat-info">
            <h4>{card.title}</h4>
            <p style={{ color: card.color }}>{card.value}</p>
          </div>
        </div>
      ))}

      <div className="admin-notes">
        <h3>System Summary</h3>
        <p>Admin: {adminData?.full_name || 'Loading...'}</p>
        <p>Last login: 10 mins ago</p>
        <p>Server status: ✅ Online</p>
      </div>
    </div>
  );
};

export default AdminLoginDashboard;
