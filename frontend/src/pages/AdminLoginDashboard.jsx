import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config';
import './AdminLoginDashboard.css'; // Make sure this CSS file has styles

const AdminLoginDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/');
      return;
    }

    axios
      .get(`${BASE_URL}api/accounts/me/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setAdminData(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch admin info:', err);
        alert('Session expired or invalid token. Please log in again.');
        localStorage.removeItem('adminToken');
        navigate('/');
      });
  }, [navigate]);

  const adminCards = [
    { title: 'Total Users', value: '300', color: '#3b82f6' },
    { title: 'Active Providers', value: '45', color: '#10b981' },
    { title: 'Reports Reviewed', value: '75', color: '#f59e0b' },
    { title: 'Pending Approvals', value: '12', color: '#ef4444' },
  ];

  return (
    <div className="stat-cards-grid">
      {adminCards.map(card => (
        <div key={card.title} className="stat-card">
          <div className="stat-info">
            <h4>{card.title}</h4>
            <p style={{ color: card.color }}>{card.value}</p>
          </div>
        </div>
      ))}

      <div className="admin-notes">
        <h3>System Summary</h3>
        <p>Last login: 10 mins ago</p>
        <p>Server status: ✅ Online</p>
      </div>
    </div>
  );
};

export default AdminLoginDashboard;
