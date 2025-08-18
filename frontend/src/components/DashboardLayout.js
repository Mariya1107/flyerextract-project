import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../config";
import "../pages/ProviderLoginDashboard.css";

const Icon = ({ name }) => <div className="icon">{name.charAt(0)}</div>;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [storeName, setStoreName] = useState("");
  const [providerData, setProviderData] = useState(null);
  const [showUploadSubmenu, setShowUploadSubmenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get(`${BASE_URL}/api/accounts/me/`, {
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
        setProviderData(res.data);
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

  const profileImageUrl = providerData?.profile_photo
    ? providerData.profile_photo.startsWith("http")
      ? providerData.profile_photo
      : `${BASE_URL}/${providerData.profile_photo}`
    : null;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <Link to="/" aria-label="Home">
             <h2 className="logo">Gravity</h2>
                        
                      </Link>
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
  <Link to={`/provider-dashboard/brochures`}>
    <Icon name="B" />
    <span>Brochures</span>
  </Link>
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
                    
                  </ul>
                )}
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
            <input type="text" className="search-bar" placeholder="Search..." />
            <h2 className="store-name-title">
              {storeName ? `Welcome to ${storeName}` : "Loading store..."}
            </h2>

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
                providerData?.full_name?.charAt(0) || "P"
              )}
            </div>

{showProfileDropdown && providerData && (
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
        alt="Profile Large"
        className="profile-image-large"
      />
    )}
    <p><strong>{providerData.full_name}</strong></p>
    <p>{providerData.email}</p>
    <p>{providerData.phone}</p>
    <p>{providerData.gender}</p>
    <button onClick={() => navigate("/provider-dashboard/edit-profile")}>
      Edit Profile
    </button>
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

export default DashboardLayout;
