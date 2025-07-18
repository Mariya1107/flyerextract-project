import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './ProviderLoginDashboard.css';
import axios from "axios";
import BASE_URL from "../config";
import UploadBrochure from "./UploadBrochure";


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

  const [stores, setStores] = useState([]);
  const [showProviders, setShowProviders] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (!token) {
      alert("Access denied. Please login as a provider.");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    axios.get(`${BASE_URL}/stores/`)
      .then((res) => setStores(res.data))
      .catch((err) => console.error("Error fetching stores", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    navigate("/");
  };
  const handleBrochureClick = () => {
    const storeId = localStorage.getItem("store_id");
    console.log("Retrieved store ID:", storeId);
    if (storeId) {
      navigate(`/store/${storeId}/flyers`);
    } else {
      alert("Store not found. Please log in again.");
    }
  };
  const statCards = [
    { title: 'Number of Brochures', value: '30', change: 15, trend: 'up', color: '#3b82f6', data: [5, 10, 8, 14, 12, 18] },
    { title: 'Number of Products', value: '25', change: 10, trend: 'up', color: '#ef4444', data: [18, 12, 16, 10, 14, 9] },
    { title: 'Number of users clicked ', value: '18', change: 12, trend: 'up', color: '#22c55e', data: [8, 12, 9, 15, 11, 17] },
    { title: 'Subscriptions', value: '$650', change: 20, trend: 'down', color: '#f97316', data: [17, 12, 19, 10, 15, 11] }
  ];

  const location = useLocation();
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="logo">Gravity</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <button
                  onClick={() => {
                    window.location.href = "/provider-dashboard"; // forces full reload
                  }}
                  className="active"
                >
                  <Icon name="D" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li><a href="#" onClick={() => setShowProviders(true)}><Icon name="P" /><span>Providers</span></a></li>
              <li onClick={handleBrochureClick} style={{ cursor: "pointer" }}>
                <Icon name="B" />
                <span>Brochures</span>
              </li>
              <li>
                <div className="sidebar-category">
                  <span>Upload / Edit</span>
                  <ul className="sidebar-submenu">
                    <li onClick={() => navigate("/dashboard/upload-brochure")}>Upload Brochure</li>
                    <li onClick={() => navigate("/dashboard/edit-brochure")}>Edit Brochure Details</li>
                    <li onClick={() => navigate("/dashboard/extract-products")}>Extract Products</li>
                  </ul>
                </div>
              </li>
              <li><a href="#"><Icon name="R" /><span>Reports</span></a></li>
              <li className="nav-separator"></li>
              <li><a href="#"><Icon name="E" /><span>Edit Profile</span></a></li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  <Icon name="L" />
                  <span>Log Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <div className="dashboard-main-header">
            <input type="text" className="search-bar" placeholder="Search in dashboard..." />
            <div className="profile-icon">P</div>
          </div>

          {showProviders ? (
            <div className="category-grid">
              {stores.map((store) => (
                <div
                  className="category-card"
                  key={store.id}
                  onClick={() => navigate(`/store/${store.id}/flyers`)}
                >
                  <div className="category-icon">
                    <img
                      src={
                        store.logo?.startsWith("http")
                          ? store.logo
                          : `${BASE_URL}${store.logo}`
                      }
                      alt={store.name}
                      className="img-fluid"
                      onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/100x100?text=Logo")
                      }
                    />
                  </div>
                  <h6>{store.name}</h6>
                  <p>View Flyers</p>
                </div>
              ))}
            </div>
          ) : (
            <>
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
                    <h3>Traffic to Page</h3>
                    <select><option>Monthly</option><option>Yearly</option></select>
                  </div>
                  <RevenueChart />
                </div>

                <div className="chart-container">
                  <div className="dashboard-chart-header">
                    <h3>Most searched product</h3>
                    <select><option>Monthly</option><option>Yearly</option></select>
                  </div>
                  <ProvidersBarChart />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProviderLoginDashboard;
