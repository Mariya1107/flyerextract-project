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

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token"); 
        if (!token) {
          setError("⚠️ No admin token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/accounts/stores/`, {
          headers: {
            Authorization: `Token ${token}`, // DRF TokenAuthentication
          },
        });

        setStores(res.data.results || res.data); // works with paginated + non-paginated
      } catch (err) {
        console.error("Failed to fetch stores", err);
        setError("❌ Failed to load stores. Unauthorized or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleStoreClick = (storeId) => {
    navigate(`/admin-dashboard/store/${storeId}/brochures`);
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
              onClick={() => handleStoreClick(store.id)}
            >
              <div className="category-icon">
                <img
                  src={
                    store.logo?.startsWith("http")
                      ? store.logo
                      : `${BASE_URL}/${store.logo}`
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
              <p>View Brochures</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBrochure;
