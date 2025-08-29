import React, { useState } from "react";
import axios from "axios";
import "./ProviderLogin.css";
import BASE_URL from '../config';

const ProviderLogin = ({ setShowProviderModal }) => {
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/api/accounts/login/provider/`,
        {
          identifier: credentials.identifier, // username OR phone
          password: credentials.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response:", res.data); // 🔍 Debug

      const token = res.data.token;
      const providerId = res.data.user?.id || res.data.id;

      localStorage.setItem("providerToken", token);
      localStorage.setItem("providerId", providerId);

      alert("Provider login successful");
      setShowProviderModal(false);
      window.location.href = "/provider-dashboard";
    } catch (err) {
      console.error("Login failed - full error object:", err);
      console.error("Login failed - response data:", err.response?.data);
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
          <label>Username or Phone</label>
          <input
            type="text"
            name="identifier"
            value={credentials.identifier}
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
