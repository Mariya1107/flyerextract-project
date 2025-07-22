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
  const [showForm, setShowForm] = useState(true); // control form visibility

  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("store_id");

  useEffect(() => {
    axios
      .get(`${BASE_URL}regions/`)
      .then((res) => setRegionList(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("store", storeId);
    formData.append("region", regionId);
    formData.append("expires_at", expiryDate);

    if (pdfFile) formData.append("pdf", pdfFile);
    if (imageFile) formData.append("image", imageFile);

    try {
const res = await axios.post(`${BASE_URL}flyers/upload/`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Token ${token}`,
  },
});
      alert("Brochure uploaded!");
      setTitle("");
      setPdfFile(null);
      setImageFile(null);
      setExpiryDate("");
      setRegionId("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  if (!showForm) return null; // hide form if closed

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
              {region.name}
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
