// AdminStoreBrochure.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlyerList.css';
import BASE_URL from '../config';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AdminStoreBrochure = () => {
  const { storeId } = useParams();
  const [brochures, setBrochures] = useState([]);
  const [numPages, setNumPages] = useState({});

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const token = localStorage.getItem('adminToken'); // Adjust if your token key is different
        const res = await axios.get(`${BASE_URL}/api/stores-with-flyers/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const store = res.data.find((s) => s.id === parseInt(storeId));
        if (store) {
          setBrochures(store.flyers);
        } else {
          setBrochures([]);
        }
      } catch (err) {
        console.error('Error fetching brochures:', err);
        setBrochures([]);
      }
    };

    fetchBrochures();
  }, [storeId]);

  const onDocumentLoadSuccess = (brochureId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [brochureId]: numPages }));
  };

  return (
    <div className="flyer-list-wrapper">
      

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
                    <button className="flyer-hover-btn" disabled>View Details</button>
                  </div>
                </div>
                <span className="flyer-tag">📌 Brochure</span>
              </div>

              <div className="flyer-info">
                <button className="flyer-view-btn" disabled>Explore →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStoreBrochure;
