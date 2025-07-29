import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlyerList.css';
import './UsersAdminDash.css';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AdminStoreBrochureExtract = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [brochures, setBrochures] = useState([]);
  const [numPages, setNumPages] = useState({});
  const token = localStorage.getItem('adminToken');

  const fetchBrochures = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/stores-with-flyers/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const store = res.data.find((s) => s.id === parseInt(storeId));
      setBrochures(store ? store.flyers : []);
    } catch (err) {
      console.error('Error fetching brochures:', err);
      setBrochures([]);
    }
  };

  useEffect(() => {
    fetchBrochures();
  }, [storeId]);

  const onDocumentLoadSuccess = (brochureId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [brochureId]: numPages }));
  };

  return (
    <div className="flyer-list-wrapper">
      <div className="table-header">
        <h2 className="dashboard-title">Store Brochure Extracts</h2>
      </div>

      {brochures.length === 0 ? (
        <p className="no-flyers">🚫 No brochures available for this store.</p>
      ) : (
        <div className="flyer-grid">
          {brochures.map((brochure) => (
            <div key={brochure.id} className="flyer-card fade-in">
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {brochure.image ? (
                    <img
                      src={brochure.image}
                      alt={brochure.title || 'Brochure'}
                      className="flyer-img"
                    />
                  ) : brochure.pdf ? (
                    <div className="pdf-container">
                      <Document
                        file={brochure.pdf}
                        onLoadSuccess={(pdf) => onDocumentLoadSuccess(brochure.id, pdf)}
                        loading="Loading PDF..."
                      >
                        <Page pageNumber={1} width={240} />
                      </Document>
                    </div>
                  ) : (
                    <p>No preview available</p>
                  )}
                  <div className="flyer-hover-overlay">
<Link to={`/admin-dashboard/crop-products/${brochure.id}`}>
  <button className="flyer-hover-btn">Crop</button>
</Link>
                  </div>
                </div>
                <span className="flyer-tag">📌 Brochure</span>
              </div>

              <div className="flyer-info">
                <strong>{brochure.title || 'Untitled Brochure'}</strong>
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

export default AdminStoreBrochureExtract;
