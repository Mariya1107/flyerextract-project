import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./EditProfile.css";


const EditProfileAdmin = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    profile_photo: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/accounts/me/`, {
          headers: { Authorization: `Token ${token}` },
        });

        const data = response.data;

        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          profile_photo: null,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
        alert(
          err.response?.status === 401
            ? "Unauthorized: Please log in again."
            : "Error loading profile. Check console for details."
        );
      }
    };

    if (token) {
      fetchProfile();
    } else {
      alert("No admin token found. Please log in.");
    }
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
      if (formData[key]) {
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
        alert("Admin profile updated successfully.");
        setIsEditing(false);
        setFormData((prev) => ({
          ...prev,
          ...res.data,
          profile_photo: null, // reset file input
        }));
      })
      .catch((err) => {
        console.error("Update error:", err.response?.data || err.message);
        alert("Failed to update: " + JSON.stringify(err.response?.data));
      });
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Admin Profile</h2>
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
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
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

export default EditProfileAdmin;
