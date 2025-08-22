import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import "../pages/ProviderLoginDashboard.css";
import "./ProvidersAdminDash.css"; // Reuse styles

const AdminBrochure = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper to get full image URL
  const getImageUrl = (logo) => {
    if (!logo) return "https://via.placeholder.com/100x100?text=Logo";
    return logo.startsWith("http") ? logo : `${BASE_URL}${logo.startsWith("/") ? "" : "/"}${logo}`;
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token"); 
        if (!token) {
          setError("⚠️ No admin token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/stores/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setStores(res.data.results || res.data); // handle paginated + non-paginated
      } catch (err) {
        console.error("Failed to fetch stores", err);
        setError("❌ Failed to load stores. Unauthorized or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Navigate using store slug instead of ID
  const handleStoreClick = (storeSlug) => {
    navigate(`/admin-dashboard/store/${storeSlug}/brochures`);
  };

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h2 className="dashboard-title">All Store Brochures</h2>
      </div>

      {loading ? (
        <p>⏳ Loading stores...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : stores.length === 0 ? (
        <p>🚫 No stores found.</p>
      ) : (
        <div className="category-grid">
          {stores.map((store) => (
            <div
              className="category-card"
              key={store.id}
              onClick={() => handleStoreClick(store.slug)} // Use slug here
            >
              <div className="category-icon">
                <img
                  src={getImageUrl(store.logo)}
                  alt={store.name}
                  className="img-fluid"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/100x100?text=Logo")}
                />
              </div>
              <h6>{store.name}</h6>
              <p>View Brochures</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBrochure;
