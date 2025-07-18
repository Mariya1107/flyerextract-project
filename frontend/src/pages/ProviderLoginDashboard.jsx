import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderLoginDashboard.css';

const Icon = ({ name }) => <div className="icon">{name.charAt(0)}</div>;

const SparkLine = ({ data, color }) => (
  <svg width="100" height="30" viewBox="0 0 100 30">
    <path
      d={`M 0 ${30 - data[0]} C 10 ${30 - data[0]}, 10 ${30 - data[1]}, 20 ${30 - data[1]} S 30 ${30 - data[2]}, 40 ${30 - data[2]} S 50 ${30 - data[3]}, 60 ${30 - data[3]} S 70 ${30 - data[4]}, 80 ${30 - data[4]} S 90 ${30 - data[5]}, 100 ${30 - data[5]}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const RevenueChart = () => (
  <svg width="100%" height="250" viewBox="0 0 500 250">
    <defs>
      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgba(135, 163, 232, 0.5)' }} />
        <stop offset="100%" style={{ stopColor: 'rgba(135, 163, 232, 0)' }} />
      </linearGradient>
    </defs>
    {[0, 60, 120, 180, 240].map(y => (
      <line key={y} x1="30" y1={y} x2="490" y2={y} stroke="#eef2f7" strokeWidth="1" />
    ))}
    <path
      d="M 30 180 C 80 160, 130 190, 180 170 S 280 120, 330 100 S 430 50, 480 80"
      stroke="#87a3e8"
      strokeWidth="2"
      fill="url(#areaGradient)"
    />
    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((label, i) => (
      <text key={label} x={30 + i * 75} y="250" fontSize="12" fill="#6c757d">
        {label}
      </text>
    ))}
  </svg>
);

const ProvidersBarChart = () => {
  const data = [150, 80, 175, 145, 170, 60, 195, 115, 185];
  const barWidth = 30;
  const gap = 20;
  return (
    <svg width="100%" height="250" viewBox="0 0 500 250">
      {[0, 50, 100, 150, 200, 250].map(y => (
        <line key={y} x1="30" y1={235 - y} x2="490" y2={235 - y} stroke="#eef2f7" strokeWidth="1" />
      ))}
      {data.map((d, i) => (
        <rect
          key={i}
          x={30 + i * (barWidth + gap)}
          y={235 - d}
          width={barWidth}
          height={d}
          fill="#87a3e8"
          rx="4"
        />
      ))}
      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((label, i) => (
        <text key={label} x={38 + i * (barWidth + gap)} y="250" fontSize="12" fill="#6c757d">
          {label}
        </text>
      ))}
    </svg>
  );
};

const ProviderLoginDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (!token) {
      alert("Access denied. Please login as a provider.");
      navigate("/");
    }
  }, [navigate]);

  const statCards = [
    { title: 'Users', value: '30', change: 15, trend: 'up', color: '#3b82f6', data: [5, 10, 8, 14, 12, 18] },
    { title: 'Providers', value: '25', change: 10, trend: 'up', color: '#ef4444', data: [18, 12, 16, 10, 14, 9] },
    { title: 'Products', value: '18', change: 12, trend: 'up', color: '#22c55e', data: [8, 12, 9, 15, 11, 17] },
    { title: 'Subscriptions', value: '$650', change: 20, trend: 'down', color: '#f97316', data: [17, 12, 19, 10, 15, 11] }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="logo">Gravity</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="#" className="active"><Icon name="D" /><span>Dashboard</span></a></li>
              <li><a href="#"><Icon name="P" /><span>Providers</span></a></li>
              <li><a href="#"><Icon name="B" /><span>Brochures</span></a></li>
              <li><a href="#"><Icon name="U" /><span>Upload/Edit</span></a></li>
              <li><a href="#"><Icon name="R" /><span>Reports</span></a></li>
              <li className="nav-separator"></li>
              <li><a href="#"><Icon name="E" /><span>Edit Profile</span></a></li>
              <li><a href="#"><Icon name="L" /><span>Log Out</span></a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <div className="dashboard-main-header">
            <input type="text" className="search-bar" placeholder="Search in dashboard..." />
            <div className="profile-icon">P</div>
          </div>

          <div className="stat-cards-grid">
            {statCards.map(card => (
              <div key={card.title} className="stat-card">
                <div className="stat-card-info">
                  <span className="stat-card-title">{card.title}</span>
                  <span className="stat-card-value">{card.value}</span>
                  <span className={`stat-card-change ${card.trend}`}>
                    <span className="arrow">{card.trend === 'up' ? '↑' : '↓'}</span>
                    {card.change}% Current Month
                  </span>
                </div>
                <div className="sparkline-chart">
                  <SparkLine data={card.data} color={card.color} />
                </div>
              </div>
            ))}
          </div>

          <div className="chart-grid">
            <div className="chart-container">
              <div className="dashboard-chart-header">
                <h3>Revenue</h3>
                <select><option>Monthly</option><option>Yearly</option></select>
              </div>
              <RevenueChart />
            </div>

            <div className="chart-container">
              <div className="dashboard-chart-header">
                <h3>Popular Providers</h3>
                <select><option>Monthly</option><option>Yearly</option></select>
              </div>
              <ProvidersBarChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProviderLoginDashboard;
