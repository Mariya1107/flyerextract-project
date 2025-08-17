import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BASE_URL from '../config';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlyerList.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FlyerList = () => {
  const { id } = useParams();
  const [flyers, setFlyers] = useState([]);
  const [numPages, setNumPages] = useState({});

  useEffect(() => {
    axios.get(`${BASE_URL}/flyers/${id}/`)
      .then((res) => setFlyers(res.data))
      .catch((err) => console.error("Error fetching flyers:", err));
  }, [id]);

  const onDocumentLoadSuccess = (flyerId, { numPages }) => {
    setNumPages(prev => ({ ...prev, [flyerId]: numPages }));
  };

  return (
    <div className="flyer-list-wrapper">
      <h2 className="flyer-title">🔥 Latest Deals & Offers</h2>

      {flyers.length === 0 ? (
        <p className="no-flyers">🚫 No flyers available in this region.</p>
      ) : (
        <div className="flyer-grid">
          {flyers.map((flyer) => (
             <Link to={`/flyers/${flyer.id}`} key={flyer.id} className="flyer-card fade-in">
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {flyer.image ? (
                    <img src={flyer.image} alt={flyer.title} className="flyer-img" />
                  ) : (
                   <div className="pdf-container">
  <Document
    file={flyer.pdf}
    onLoadSuccess={(pdf) => onDocumentLoadSuccess(flyer.id, pdf)}
    loading="Loading PDF..."
  >
    <Page pageNumber={1} width={240} />
  </Document>
</div>
                  )}

                  <div className="flyer-hover-overlay">
                    <button className="flyer-hover-btn">View Details</button>
                  </div>
                </div>
                <span className="flyer-tag">🎁 Offer</span>
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

export default FlyerList;
