import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlyerList.css';
import BASE_URL from '../config';

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ProviderBrochureDash = () => {
  const [brochures, setBrochures] = useState([]);
  const [numPages, setNumPages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const providerId = localStorage.getItem('providerId');
    const token = localStorage.getItem('providerToken');

    if (!providerId || !token) {
      console.warn('⚠️ Missing providerId or providerToken in localStorage');
      setLoading(false);
      return;
    }

    const url = `${BASE_URL.replace(/\/$/, '')}/api/accounts/brochures/${providerId}/pages/`;

    axios
      .get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setBrochures(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching brochures:', err.response || err);
        setLoading(false);
      });
  }, []);

  const onDocumentLoadSuccess = (brochureId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [brochureId]: numPages }));
  };

  const getFullUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  if (loading) {
    return <p className="no-flyers">⏳ Loading brochures...</p>;
  }

  return (
    <div className="flyer-list-wrapper">
      <h2 className="flyer-title">My Brochures</h2>

      {brochures.length === 0 ? (
        <p className="no-flyers">🚫 No brochures uploaded yet.</p>
      ) : (
        <div className="flyer-grid">
          {brochures.map((brochure) => (
            <div key={brochure.id} className="flyer-card fade-in">
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {brochure.image ? (
                    <img
                      src={getFullUrl(brochure.image)}
                      alt={brochure.title || 'Brochure'}
                      className="flyer-img"
                      onError={(e) =>
                        (e.target.src =
                          'https://via.placeholder.com/240x300?text=No+Image')
                      }
                    />
                  ) : brochure.pdf ? (
                    <div className="pdf-container">
                      <Document
                        file={getFullUrl(brochure.pdf)}
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
                    <button className="flyer-hover-btn" disabled>
                      View Details
                    </button>
                  </div>
                </div>
                <span className="flyer-tag">📌 Brochure</span>
              </div>

              <div className="flyer-info">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <strong>{brochure.title || 'Untitled Brochure'}</strong>
                  {brochure.expires_at && (
                    <span style={{ color: 'red', fontSize: '1.1rem' }}>
                      Expires: {new Date(brochure.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
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

export default ProviderBrochureDash;
