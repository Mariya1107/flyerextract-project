import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import './EditProfile.css';

const AddUserModal = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    is_active: false,
    is_provider: false,
    is_staff: false,
    is_superuser: false,
    profile_photo: null,
    stores: [], // Updated to match backend ManyToManyField
  });

  const [storeOptions, setStoreOptions] = useState([]);

  // Fetch store options on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get(`${BASE_URL}/api/accounts/stores/`, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => setStoreOptions(res.data))
    .catch(err => console.error("Error fetching stores:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, profile_photo: files[0] });
    } else if (name === "stores") {
      // allow selecting multiple stores
      const options = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, stores: options });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    const data = new FormData();

    // Append all fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "stores") {
          value.forEach(storeId => data.append("stores", storeId)); // For ManyToMany
        } else {
          data.append(key, value);
        }
      }
    });

    axios.post(`${BASE_URL}/api/accounts/admin/users/create/`, data, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })
    .then(() => {
      onUserAdded(); // Refresh user list
      onClose();     // Close modal
    })
    .catch((error) => {
      console.error("Error adding user:", error.response?.data || error.message);
      alert("❌ Error adding user. Please check input values.");
    });
  };

  return (
    <div className="modal">
      <div className="modal-content edit-profile-container">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Add New User</h2>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} />
          <input name="full_name" placeholder="Full Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} required />

          <label>
            <input type="checkbox" name="is_active" onChange={handleChange} /> Active
          </label>
          <label>
            <input type="checkbox" name="is_provider" onChange={handleChange} /> Provider
          </label>
          <label>
            <input type="checkbox" name="is_staff" onChange={handleChange} /> Staff
          </label>
          <label>
            <input type="checkbox" name="is_superuser" onChange={handleChange} /> Superuser
          </label>

          <label>
            Stores (select multiple with Ctrl/Cmd):
            <select
              name="stores"
              multiple
              value={formData.stores}
              onChange={handleChange}
            >
              {storeOptions.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </label>

          <label>
            Profile Photo:
            <input type="file" name="profile_photo" accept="image/*" onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="submit">Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
