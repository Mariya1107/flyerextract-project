import React, { useState } from "react";
import axios from "axios";
import "./ProviderLogin.css";
import BASE_URL from "../config";

const ProviderLogin = ({ setShowProviderModal }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
  e.preventDefault(); // ⛔ Prevent default GET request from form submission

  try {
    const res = await axios.post(
      `${BASE_URL}/accounts/login/provider/`,
      credentials,
      { headers: { "Content-Type": "application/json" } }
    );

    localStorage.setItem("providerToken", res.data.token);
    alert("Provider login successful");
    setShowProviderModal(false);
    window.location.href = "/provider-dashboard";
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    alert("Login failed. Invalid credentials.");
  }
};


  return (
    <div className="provider-modal-overlay">
      <div className="provider-modal">
        <button className="close-btn" onClick={() => setShowProviderModal(false)}>
          &times;
        </button>
        <h2>Provider Login</h2>
        <form onSubmit={handleLogin} className="provider-login-form">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default ProviderLogin;
