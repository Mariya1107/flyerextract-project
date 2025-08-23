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
  const [store, setStore] = useState({ id: "", name: "" });

  // ✅ Provider token
  const token = localStorage.getItem("providerToken");
  const storeId = localStorage.getItem("store_id");
  const storeName = localStorage.getItem("store_name"); // optional: store name saved

  // Preselect provider's store
  useEffect(() => {
    if (storeId) {
      setStore({ id: storeId, name: storeName || "Your Store" });
    }
  }, [storeId, storeName]);

  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${BASE_URL}/regions/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setRegionList(res.data);
      } catch (err) {
        console.error("Region fetch error:", err.response?.data || err);
        alert(`Unable to fetch regions: ${err.message}`);
      }
    };
    fetchRegions();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return alert("You must be logged in to upload a brochure.");
    if (!regionId || !title) return alert("Region and title are required!");
    if (!pdfFile && !imageFile) return alert("Please select at least a PDF or an Image file.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("store_id", parseInt(store.id));
    formData.append("region_id", parseInt(regionId));
    formData.append("expires_at", expiryDate);
    if (pdfFile) formData.append("pdf", pdfFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.post(`${BASE_URL}/flyers/upload_pending/`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Token ${token}` },
      });
      alert("✅ Brochure uploaded successfully!");

      // Reset form
      setTitle("");
      setPdfFile(null);
      setImageFile(null);
      setExpiryDate("");
      setRegionId("");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      const message =
        err.response?.data?.detail ||
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
        <label>
          Store:
          <input type="text" value={store.name} disabled />
        </label>

        <label>
          Region:
          <select value={regionId} onChange={(e) => setRegionId(e.target.value)} required>
            <option value="">Select Region</option>
            {regionList.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}, {region.country?.name}
              </option>
            ))}
          </select>
        </label>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />

        <label>PDF File (optional)</label>
        <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />

        <label>Image File (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadBrochure;
