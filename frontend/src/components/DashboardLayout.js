import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../config"; // make sure this is pointing to your API config
import "../pages/ProviderLoginDashboard.css";

const Icon = ({ name }) => <div className="icon">{name.charAt(0)}</div>;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [storeName, setStoreName] = useState("");
  const [showUploadSubmenu, setShowUploadSubmenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (!token) {
      navigate("/");
      return;
    }

    axios.get(`${BASE_URL}/api/accounts/me/`, {
      headers: { Authorization: `Token ${token}` },
    })
    .then((res) => {
      const storeList = res.data.stores || [];
      if (storeList.length > 0) {
        const store = storeList[0];
        localStorage.setItem("store_id", store.id);
        setStoreName(store.name);
      } else {
        alert("No store assigned to this provider.");
      }
    })
    .catch((err) => {
      console.error("Failed to fetch user info:", err);
      alert("Session expired or invalid credentials. Please login again.");
      localStorage.removeItem("providerToken");
      navigate("/");
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    localStorage.removeItem("store_id");
    navigate("/");
  };

  const handleBrochureClick = () => {
    const storeId = localStorage.getItem("store_id");
    if (storeId) {
      navigate(`/store/${storeId}/flyers`);
    } else {
      alert("Store not found.");
    }
  };

  const isActive = (path) => location.pathname === path;

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
                  onClick={() => navigate("/provider-dashboard")}
                  className={isActive("/provider-dashboard") ? "active" : ""}
                >
                  <Icon name="D" />
                  <span>Dashboard</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/provider-dashboard/providers")}
                  className={isActive("/provider-dashboard/providers") ? "active" : ""}
                >
                  <Icon name="P" />
                  <span>Providers</span>
                </button>
              </li>

              <li>
                <button onClick={handleBrochureClick}>
                  <Icon name="B" />
                  <span>Brochures</span>
                </button>
              </li>

              <li className="sidebar-item">
                <button
                  className="sidebar-button"
                  onClick={() => setShowUploadSubmenu(!showUploadSubmenu)}
                >
                  <Icon name="U" />
                  <span style={{ flexGrow: 1 }}>Upload / Edit</span>
                  <FaChevronDown className={showUploadSubmenu ? "rotate" : ""} />
                </button>

                {showUploadSubmenu && (
                  <ul className="sidebar-submenu">
                    <li
                      className={isActive("/provider-dashboard/upload-brochure") ? "active" : ""}
                      onClick={() => navigate("/provider-dashboard/upload-brochure")}
                    >
                      Upload Brochure
                    </li>
                    <li
                      className={isActive("/provider-dashboard/edit-brochure") ? "active" : ""}
                      onClick={() => navigate("/provider-dashboard/edit-brochure")}
                    >
                      Edit Brochure
                    </li>
                    <li
                      className={isActive("/provider-dashboard/extract-products") ? "active" : ""}
                      onClick={() => navigate("/provider-dashboard/extract-products")}
                    >
                      Extract Products
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button>
                  <Icon name="R" />
                  <span>Reports</span>
                </button>
              </li>

              <li className="nav-separator"></li>

<li>
  <button
    onClick={() => navigate("/provider-dashboard/edit-profile")}
    className={isActive("/provider-dashboard/edit-profile") ? "active" : ""}
  >
    <Icon name="E" />
    <span>Edit Profile</span>
  </button>
</li>

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
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
            />
            <h2 className="store-name-title">
              {storeName ? `Welcome to ${storeName}` : "Loading store..."}
            </h2>
            <div className="profile-icon">P</div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
