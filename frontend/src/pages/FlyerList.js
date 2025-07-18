import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BASE_URL from '../config';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlyerList.css'; // ✅ Import the CSS

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FlyerList = () => {
  const { id } = useParams();
  const [flyers, setFlyers] = useState([]);
  const [numPages, setNumPages] = useState({});

  useEffect(() => {
    axios.get(`${BASE_URL}flyers/${id}/`)
      .then((res) => {
        setFlyers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching flyers:", err);
      });
  }, [id]);

  const onDocumentLoadSuccess = (flyerId, { numPages }) => {
    setNumPages(prev => ({ ...prev, [flyerId]: numPages }));
  };

  return (
    <div className="flyer-list-wrapper">
      <h2 className="flyer-title">Flyers in Region {id}</h2>

      {flyers.length === 0 ? (
        <p className="no-flyers">No flyers found.</p>
      ) : (
        <div className="flyer-grid">
          {flyers.map((flyer) => (
            <Link to={`/flyers/${flyer.id}`} key={flyer.id} className="flyer-card">
              <div className="flyer-image-container">
                {flyer.image ? (
                  <img src={flyer.image} alt={flyer.title} className="flyer-img" />
                ) : (
                  <Document
                    file={flyer.pdf}
                    onLoadSuccess={(pdf) => onDocumentLoadSuccess(flyer.id, pdf)}
                    loading="Loading PDF..."
                  >
                    <Page pageNumber={1} width={200} />
                  </Document>
                )}
              </div>
              <div className="flyer-info">
                <h3 className="flyer-heading">{flyer.title}</h3>
                <p className="flyer-meta">Store: {flyer.store.name}</p>
                <p className="flyer-meta">Region: {flyer.region.name}, {flyer.region.country.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlyerList;
