import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./EditProfile.css";

const EditIconUserAdmin = ({ userId, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    profile_photo: null,
    is_active: true,
    is_provider: false,
    username: "",
    store_id: "",
  });

  const [storeOptions, setStoreOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/accounts/admin/users/${userId}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        const user = res.data;

        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          profile_photo: null,
          is_active: user.is_active,
          is_provider: user.is_provider,
          username: user.username || "",
          store_id: user.stores?.length > 0 ? user.stores[0].id : "",
        });
      } catch (error) {
        console.error("Failed to load user:", error);
        alert("Failed to load user data.");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllStores = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/accounts/stores/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setStoreOptions(res.data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    fetchUser();
    fetchAllStores();
  }, [userId, token, onClose]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSave = () => {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }

    axios
      .put(`${BASE_URL}/api/accounts/admin/users/${userId}/update/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("User updated successfully.");
        onUpdated();
        onClose();
      })
      .catch((err) => {
        console.error("Update failed:", err.response?.data || err.message);
        alert("Failed to update user.");
      });
  };

  if (isLoading) return <div className="modal">Loading...</div>;

  return (
    <div className="modal">
<div className="modal-content edit-profile-container">
  <button className="close-button" onClick={onClose}>✖</button>
  <h2>Edit User</h2>
        <form className="edit-profile-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Full Name:
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input name="email" value={formData.email} onChange={handleChange} />
          </label>

          <label>
            Phone:
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </label>


          <label>
            Profile Photo:
            <input type="file" name="profile_photo" onChange={handleChange} />
          </label>

          <label>
            Username:
            
          <input
  name="username"
  type="text"
  value={formData.username}
  onChange={handleChange}
/>

          </label>

          <label>
            Is Provider:
            <input
              type="checkbox"
              name="is_provider"
              checked={formData.is_provider}
              disabled
            />
          </label>

          <label>
            Is Active:
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
          </label>

          <label>
             Superuser status:
            <input
              type="checkbox"
              name="is_superuser"
              checked={formData.is_superuser}
              onChange={handleChange}
            />
          </label>

          <label>
            Store:
            <select name="store_id" value={formData.store_id} onChange={handleChange}>
              <option value="">Select Store</option>
              {storeOptions.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIconUserAdmin;
