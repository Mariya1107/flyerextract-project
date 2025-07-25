import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlyerList.css';
import BASE_URL from '../config';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ProviderBrochureDash = () => {
  const [brochures, setBrochures] = useState([]);
  const [numPages, setNumPages] = useState({});

  useEffect(() => {
    const providerId = localStorage.getItem('providerId');
    const token = localStorage.getItem('providerToken');

    console.log('Fetched providerId:', providerId);
    console.log('Fetched providerToken:', token);

    if (providerId && token) {
      axios
        .get(`${BASE_URL}api/accounts/brochures/${providerId}/pages/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        })
        .then((res) => {
          console.log('Brochures response:', res.data);
          setBrochures(res.data);
        })
        .catch((err) => console.error('Error fetching brochures:', err));
    } else {
      console.warn('Missing providerId or providerToken in localStorage');
    }
  }, []);

  const onDocumentLoadSuccess = (brochureId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [brochureId]: numPages }));
  };

  return (
    <div className="flyer-list-wrapper">
      <h2 className="flyer-title">📄 My Brochures</h2>

      {brochures.length === 0 ? (
        <p className="no-flyers">🚫 No brochures uploaded yet.</p>
      ) : (
        <div className="flyer-grid">
          {brochures.map((brochure) => (
            <Link
              to={`/flyers/${brochure.id}`}
              key={brochure.id}
              className="flyer-card fade-in"
            >
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {brochure.image ? (
                    <img
                      src={brochure.image}
                      alt={brochure.title}
                      className="flyer-img"
                    />
                  ) : brochure.pdf ? (
                    <div className="pdf-container">
                      <Document
                        file={brochure.pdf}
                        onLoadSuccess={(pdf) =>
                          onDocumentLoadSuccess(brochure.id, pdf)
                        }
                        loading="Loading PDF..."
                      >
                        <Page pageNumber={1} width={240} />
                      </Document>
                    </div>
                  ) : (
                    <p>No preview available</p>
                  )}

                  <div className="flyer-hover-overlay">
                    <button className="flyer-hover-btn">View Details</button>
                  </div>
                </div>
                <span className="flyer-tag">📌 Brochure</span>
              </div>

              <div className="flyer-info">
                <button className="flyer-view-btn">Explore →</button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBrochureDash;
