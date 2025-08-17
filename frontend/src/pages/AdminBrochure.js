import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import "../pages/ProviderLoginDashboard.css";
import "./ProvidersAdminDash.css"; // Reuse styles
const token = localStorage.getItem("token");


const AdminBrochure = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchStores = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/accounts/stores/`, {
        headers: {
          Authorization: `Token ${token}`, // include if required
        },
      });

      // handle paginated response from DRF
      setStores(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch stores", err);
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
            <p>View Brochures</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBrochure;
