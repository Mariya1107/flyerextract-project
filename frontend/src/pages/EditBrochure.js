import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import BASE_URL from '../config';
import './FlyerList.css';
import '../pages/UploadBrochure.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const EditBrochure = () => {
  const [brochures, setBrochures] = useState([]);
  const [numPages, setNumPages] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    pdf: null,
    image: null,
    expires_at: '',
    region_id: ''
  });
  const [regionList, setRegionList] = useState([]);

  const token = localStorage.getItem('providerToken');
  const providerId = localStorage.getItem('providerId');

  useEffect(() => {
    if (providerId && token) {
      axios.get(`${BASE_URL}api/accounts/brochures/${providerId}/pages/`, {
        headers: { Authorization: `Token ${token}` }
      }).then(res => setBrochures(res.data))
        .catch(err => console.error('Fetch error:', err));
    }

    axios.get(`${BASE_URL}regions/`)
      .then(res => setRegionList(res.data))
      .catch(err => console.error('Region fetch error:', err));
  }, []);

  const onDocumentLoadSuccess = (brochureId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [brochureId]: numPages }));
  };

  const handleEditClick = (brochure) => {
    setEditingId(brochure.id);
    setFormData({
      title: brochure.title || '',
      pdf: null,
      image: null,
      expires_at: brochure.expires_at || '',
      region_id: brochure.region?.id || ''
    });
  };

const handleSave = async (e) => {
  e.preventDefault();
  if (!editingId) return;

  const updateData = new FormData();
  updateData.append('title', formData.title);
  updateData.append('expires_at', formData.expires_at);
  updateData.append('region_id', parseInt(formData.region_id));

  // If a new PDF is uploaded, include it and tell backend to delete image
  if (formData.pdf) {
    updateData.append('pdf', formData.pdf);
    updateData.append('clear_image', 'true');
  }

  // If a new image is uploaded, include it and tell backend to delete pdf
  if (formData.image) {
    updateData.append('image', formData.image);
    updateData.append('clear_pdf', 'true');
  }

  try {
    await axios.put(`${BASE_URL}flyers/${editingId}/edit/`, updateData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${token}`,
      },
    });
    alert('Brochure updated!');
    setEditingId(null);
    window.location.reload();
  } catch (err) {
    console.error('Update error:', err);
    alert('Failed to update brochure');
  }
};

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flyer-list-wrapper">
      <h2 className="flyer-title">Edit Brochures</h2>

      {brochures.length === 0 ? (
        <p className="no-flyers">🚫 No brochures uploaded yet.</p>
      ) : (
        <div className="flyer-grid">
          {brochures.map((brochure) => (
            <div key={brochure.id} className="flyer-card fade-in">
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {brochure.image ? (
                    <img src={brochure.image} alt={brochure.title} className="flyer-img" />
                  ) : brochure.pdf ? (
                    <div className="pdf-container">
                      <Document file={brochure.pdf} onLoadSuccess={(pdf) => onDocumentLoadSuccess(brochure.id, pdf)}>
                        <Page pageNumber={1} width={240} />
                      </Document>
                    </div>
                  ) : <p>No preview available</p>}

                  <div className="flyer-hover-overlay">
                    <button className="flyer-hover-btn" onClick={() => handleEditClick(brochure)}>View Details</button>
                  </div>
                </div>
                <span className="flyer-tag">📌 Brochure</span>
              </div>

              <div className="flyer-info">
                <button className="flyer-view-btn" onClick={() => handleEditClick(brochure)}>Edit →</button>
              </div>
            </div>
          ))}
        </div>
      )}

{editingId && (
  <div className="modal-overlay" onClick={() => setEditingId(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="form-header">
        <h2>Edit Brochure</h2>
        <button className="close-btn" onClick={() => setEditingId(null)}>&times;</button>
      </div>
      <form onSubmit={handleSave} className="upload-form">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <select name="region_id" value={formData.region_id} onChange={handleChange} required>
          <option value="">Select Region</option>
          {regionList.map((region) => (
            <option key={region.id} value={region.id}>{region.name}, {region.country.name}</option>
          ))}
        </select>
        <input type="date" name="expires_at" value={formData.expires_at} onChange={handleChange} required />
        <label>PDF File (optional)</label>
        <input type="file" name="pdf" accept=".pdf" onChange={handleChange} />
        <label>Image File (optional)</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default EditBrochure;