import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import "../pages/ProviderLoginDashboard.css";
import "./ProvidersAdminDash.css"; // Reuse styles

const AdminBrochureExtract = () => {
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
        const token =
          localStorage.getItem("adminToken") || localStorage.getItem("token");

        if (!token) {
          setError("⚠️ No token found. Redirecting to login...");
          setLoading(false);
          navigate("/admin-login");
          return;
        }

        const res = await axios.get(`${BASE_URL}/stores/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // handle paginated + non-paginated responses
        setStores(res.data.results || res.data);
      } catch (err) {
        console.error("Failed to fetch stores", err);
        if (err.response?.status === 401) {
          setError("❌ Unauthorized. Please log in again.");
          navigate("/admin-login");
        } else {
          setError("❌ Failed to fetch stores. Server error.");
        }
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [navigate]);

  // Use slug for navigation
  const handleStoreClick = (storeSlug) => {
    navigate(`/admin-dashboard/store/${storeSlug}/brochure-extract`);
  };

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h2 className="dashboard-title">All Store Brochure Extracts</h2>
      </div>

      {loading ? (
        <p>⏳ Loading stores...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : stores.length === 0 ? (
        <p className="no-flyers">🚫 No stores found.</p>
      ) : (
        <div className="category-grid">
          {stores.map((store) => (
            <div
              className="category-card"
              key={store.id}
              onClick={() => handleStoreClick(store.slug)} // ✅ Use slug here
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
              <p>Extract Brochures</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBrochureExtract;
