// src/components/DashboardLayoutWrapper.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import axios from "axios";
import BASE_URL from "../config";

const DashboardLayoutWrapper = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [showUploadSubmenu, setShowUploadSubmenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (!token) {
      alert("Access denied. Please login as a provider.");
      navigate("/");
      return;
    } 

    axios.get(`${BASE_URL}/api/accounts/me/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        const storeList = res.data.stores || [];
        if (storeList.length > 0) {
          const store = storeList[0];
          localStorage.setItem("store_id", store.id);
          setStoreName(store.name);
        } else {
          alert("No store assigned to this provider.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch user info:", err);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("providerToken");
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    localStorage.removeItem("store_id");
    navigate("/");
  };

  return (
    <DashboardLayout
      storeName={storeName}
      handleLogout={handleLogout}
      setShowUploadSubmenu={setShowUploadSubmenu}
      showUploadSubmenu={showUploadSubmenu}
      navigate={navigate}
    />
  );
};

export default DashboardLayoutWrapper;
