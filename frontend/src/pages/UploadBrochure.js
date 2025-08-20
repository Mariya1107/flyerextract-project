// src/pages/UploadBrochure.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "../pages/UploadBrochure.css";

const UploadBrochure = () => {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [regionList, setRegionList] = useState([]);
  const [regionId, setRegionId] = useState("");
  const [showForm, setShowForm] = useState(true);

  // ✅ Make sure we pull the correct token
  const token =
    localStorage.getItem("providerToken") || // <-- use providerToken first
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");

  const storeId = localStorage.getItem("store_id");

  // fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      if (!token) {
        console.error("⚠ No token found. Cannot fetch regions.");
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}regions/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setRegionList(res.data);
      } catch (err) {
        console.error("Region fetch error:", err.response?.data || err);
        alert(
          `⚠ Unable to fetch regions: ${
            err.response?.data?.detail || err.message
          }`
        );
      }
    };
    fetchRegions();
  }, [token]);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("⚠ You must be logged in to upload a brochure.");
      return;
    }
    if (!storeId || !regionId) {
      alert("⚠ Store and Region are required!");
      return;
    }
    if (!pdfFile && !imageFile) {
      alert("⚠ Please select at least a PDF or an Image file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("store_id", parseInt(storeId));
    formData.append("region_id", parseInt(regionId));
    formData.append("expires_at", expiryDate);
    if (pdfFile) formData.append("pdf", pdfFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.post(`${BASE_URL}flyers/upload_pending/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      alert("✅ Brochure uploaded successfully!");
      // reset form
      setTitle("");
      setPdfFile(null);
      setImageFile(null);
      setExpiryDate("");
      setRegionId("");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        JSON.stringify(err.response?.data) ||
        err.message;
      alert(`❌ Upload failed: ${message}`);
    }
  };

  if (!showForm) return null;

  return (
    <div className="upload-brochure-container">
      <div className="form-header">
        <h2>Upload Brochure</h2>
        <button className="close-btn" onClick={() => setShowForm(false)}>
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          required
        >
          <option value="">Select Region</option>
          {regionList.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}, {region.country.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
        <label>PDF File (optional)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
        />
        <label>Image File (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadBrochure;
