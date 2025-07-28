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

const handleApprove = async (flyer) => {
  console.log("📤 Approving flyer:", flyer);

  const store = flyer.store;
  const storeId = store?.id;
  const regionId = store?.region?.id;

  console.log("📦 Store object:", store);
  console.log("✅ Extracted storeId:", storeId, "regionId:", regionId);

  if (!storeId || !regionId) {
    console.error("❌ Missing store_id or region_id:", { storeId, regionId });
    return;
  }

  const payload = {
    title: flyer.title,
    image: flyer.image, // Make sure this is either a valid URL or a File object
    pdf: flyer.pdf || null,
    store: storeId,
    region: regionId,
    expires_at: flyer.expires_at || "2025-08-31" // hardcoded or let admin select
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/flyers/create/`, payload);
    console.log("✅ Flyer approved:", response.data);
  } catch (error) {
    console.error("❌ Error approving flyer:", error.response?.data || error.message);
  }
};


  const handleReject = async (id) => {
    const confirmed = window.confirm('Reject this flyer?');
    if (!confirmed) return;

    try {
      await axios.post(`${BASE_URL}/admin/reject-flyer/${id}/`, null, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchPendingFlyers();
    } catch (err) {
      console.error('❌ Error rejecting flyer:', err.response?.data || err.message);
      alert('Failed to reject flyer.');
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
