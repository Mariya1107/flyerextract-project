import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlyerList.css';
import './UsersAdminDash.css';
import BASE_URL from '../config';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ApprovalAdmin = () => {
  const [pendingFlyers, setPendingFlyers] = useState([]);
  const [numPages, setNumPages] = useState({});
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchPendingFlyers();
  }, []);

  const fetchPendingFlyers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/flyers/pending/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setPendingFlyers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching pending flyers:', err);
    }
  };

  const onDocumentLoadSuccess = (flyerId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [flyerId]: numPages }));
  };

  const urlToFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleApprove = async (flyer) => {
    console.log("📤 Approving flyer:", flyer);

    const storeId = flyer?.store?.id;
    const regionId = flyer?.region?.id;

    if (!storeId || !regionId) {
      console.error("❌ Missing store_id or region_id:", { storeId, regionId });
      alert("Missing store or region info. Cannot approve flyer.");
      return;
    }

    const formData = new FormData();
    formData.append("title", flyer.title);
    formData.append("store_id", storeId);
    formData.append("region_id", regionId);
    formData.append("expires_at", flyer.expires_at || "2025-08-31");

    if (flyer.image && typeof flyer.image === "string") {
      const imageFile = await urlToFile(flyer.image, "flyer_image.jpg");
      formData.append("image", imageFile);
    }

    if (flyer.pdf && typeof flyer.pdf === "string") {
      const pdfFile = await urlToFile(flyer.pdf, "flyer.pdf");
      formData.append("pdf", pdfFile);
    }

    try {
      await axios.post(`${BASE_URL}/api/flyers/create/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Cleanup from pending list
      try {
        await axios.delete(`${BASE_URL}/api/reject-flyer/${flyer.id}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        alert("✅ Brochure approved and removed from pending list!");
      } catch (cleanupErr) {
        console.warn("⚠️ Flyer created but failed to remove from pending list:", cleanupErr);
        alert("⚠️ Brochure approved, but failed to remove from pending list.");
      }

      fetchPendingFlyers();
    } catch (error) {
      console.error("❌ Error approving flyer:", error.response?.data || error.message);
      alert("❌ Approval failed: " + (error.response?.data?.detail || error.message));
    }
  };
const handleReject = async (flyerId) => {
  const confirmed = window.confirm('Are you sure you want to reject this flyer?');
  if (!confirmed) return;

  
  try {
    await axios.delete(`${BASE_URL}/api/reject-flyer/${flyerId}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    alert("❌ Flyer rejected and removed.");
    fetchPendingFlyers(); // Refresh the list
  } catch (error) {
    console.error("❌ Error rejecting flyer:", error.response?.data || error.message);
    alert("❌ Failed to reject flyer: " + (error.response?.data?.detail || error.message));
  }
};

  return (
    <div className="flyer-list-wrapper">
      <h2 className="dashboard-title">Pending Brochures for Approval</h2>
      {pendingFlyers.length === 0 ? (
        <p className="no-flyers">✅ No brochures pending approval.</p>
      ) : (
        <div className="flyer-grid">
          {pendingFlyers.map((flyer) => (
            <div key={flyer.id} className="flyer-card fade-in">
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {flyer.image ? (
                    <img
                      src={flyer.image}
                      alt={flyer.title || 'Brochure'}
                      className="flyer-img"
                    />
                  ) : flyer.pdf ? (
                    <div className="pdf-container">
                      <Document
                        file={flyer.pdf}
                        onLoadSuccess={(pdf) => onDocumentLoadSuccess(flyer.id, pdf)}
                        loading="Loading PDF..."
                      >
                        <Page pageNumber={1} width={240} />
                      </Document>
                    </div>
                  ) : (
                    <p>No preview available</p>
                  )}

                  <div className="flyer-hover-overlay">
                    <button
                      className="flyer-hover-btn"
                      style={{ marginRight: '15px' }}
                      onClick={() => handleApprove(flyer)}
                    >
                      Accept
                    </button>
                    <button
                      className="flyer-hover-btn"
                      onClick={() => handleReject(flyer.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <span className="flyer-tag">📝 Pending</span>
              </div>

              <div className="flyer-info">
                <strong>{flyer.title || 'Untitled Brochure'}</strong>
                <button className="flyer-view-btn" disabled>
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalAdmin;
