import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    store: "",
    profile_photo: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("providerToken");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/accounts/me/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          store: data.stores?.[0]?.name || "",
          profile_photo: null,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        alert("Error loading profile.");
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = () => {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] && key !== "store") {
        data.append(key, formData[key]);
      }
    }

    axios
  .put(`${BASE_URL}/api/accounts/me/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert("Profile updated successfully.");
        setIsEditing(false);
        // Update form data with new values
        setFormData((prev) => ({
          ...prev,
          ...res.data,
          store: prev.store, // preserve store info
          profile_photo: null, // reset file input
        }));
      })
      .catch((err) => {
        console.error("Update failed:", err);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Profile Photo:
          <input
            type="file"
            name="profile_photo"
            accept="image/*"
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>

        <label>
          Full Name:
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>

        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </label>

        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </label>

        <label>
          Store:
          <input type="text" value={formData.store} disabled readOnly />
        </label>

        <div className="form-actions" style={{ display: "flex", gap: "20px" }}>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          >
            Edit
          </button>
          <button type="button" onClick={handleSave} disabled={!isEditing}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
