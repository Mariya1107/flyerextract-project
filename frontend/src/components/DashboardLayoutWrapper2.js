import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout2 from "./DashboardLayout2";

const DashboardLayoutWrapper2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Access denied. Please login as an admin.");
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <DashboardLayout2 handleLogout={handleLogout} />
  );
};

export default DashboardLayoutWrapper2;
