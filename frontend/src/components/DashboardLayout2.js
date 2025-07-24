import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config';
import "../pages/AdminLoginDashboard.css";

const Icon = ({ name }) => <div className="icon">{name.charAt(0)}</div>;

const DashboardLayout2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminData, setAdminData] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/");
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
        console.error("Failed to fetch admin info:", err);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const goToEditProfile = () => {
    navigate("/admin-dashboard/edit-profile");
  };

  const isActive = (path) => location.pathname === path;

  const profileImageUrl = adminData?.profile_photo
    ? adminData.profile_photo.startsWith("http")
      ? adminData.profile_photo
      : `${BASE_URL}${adminData.profile_photo}`
    : null;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <aside className="sidebar scrollable-sidebar">
          <div className="sidebar-header">
            <h2 className="logo">Gravity</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <Link
                  to="/admin-dashboard"
                  className={isActive("/admin-dashboard") ? "active" : ""}
                >
                  <Icon name="D" /><span>Dashboard</span>
                </Link>
              </li>
              <li>
  <Link
    to="/admin-dashboard/users"
    className={isActive("/admin-dashboard/users") ? "active" : ""}
  >
    <Icon name="U" /><span>Users</span>
  </Link>
</li>

              <li>
  <Link
    to="/admin-dashboard/providers"
    className={isActive("/admin-dashboard/providers") ? "active" : ""}
  >
    <Icon name="P" /><span>Providers</span>
  </Link>
</li>
              <li>
 <Link to="countries">
    <Icon name="C" />
    <span>Country</span>
  </Link>
</li>
              <li>
  <Link
    to="/admin-dashboard/regions"
    className={isActive("/admin-dashboard/regions") ? "active" : ""}
  >
    <Icon name="R" /><span>Region</span>
  </Link>
</li>
              <li><a href="#"><Icon name="PA" /><span>Provider Applications</span></a></li>
              <li><a href="#"><Icon name="B" /><span>Brochures</span></a></li>
              <li><a href="#"><Icon name="P" /><span>Products</span></a></li>
              <li><a href="#"><Icon name="R" /><span>Reports</span></a></li>
              <li><a href="#"><Icon name="A" /><span>Approvals</span></a></li>
              <li className="nav-separator"></li>
              <li>
                <button onClick={goToEditProfile}><Icon name="E" /><span>Edit Profile</span></button>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  <Icon name="L" /><span>Log Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content1">
          <div className="dashboard-main-header1">
            <input type="text" className="search-bar" placeholder="Search..." />
            <h2 className="header-welcome-text">Welcome To Admin Dashboard</h2>

            <div
              className="profile-icon"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                adminData?.full_name?.charAt(0) || "A"
              )}
            </div>

            {showProfileDropdown && adminData && (
              <div className="profile-dropdown">
                <button
                  className="close-btn"
                  onClick={() => setShowProfileDropdown(false)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "10px",
                    background: "transparent",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "#333",
                  }}
                >
                  ✖
                </button>

                {profileImageUrl && (
                  <img
                    src={profileImageUrl}
                    alt="Admin Profile"
                    className="profile-image-large"
                  />
                )}

                <p><strong>{adminData.full_name}</strong></p>
                <p>{adminData.email}</p>
                <p>{adminData.phone}</p>

                <button onClick={goToEditProfile}>Edit Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout2;
