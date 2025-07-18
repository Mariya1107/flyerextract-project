import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../config';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FlyerList = () => {
  const { id } = useParams(); // region ID from URL
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
    <div>
      <h2>Flyers in Region {id}</h2>
      {flyers.length === 0 ? (
        <p>No flyers found.</p>
      ) : (
        <ul>
          {flyers.map((flyer) => (
<li key={flyer.id} style={{ marginBottom: "30px" }}>
  <Link to={`/flyers/${flyer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <h3>{flyer.title}</h3>

    {flyer.image ? (
      <img src={flyer.image} alt={flyer.title} width="200" />
    ) : (
      <div style={{ width: '200px' }}>
        <Document
          file={flyer.pdf}
          onLoadSuccess={(pdf) => onDocumentLoadSuccess(flyer.id, pdf)}
          loading="Loading PDF..."
        >
          <Page pageNumber={1} width={200} />
        </Document>
      </div>
    )}

    <p>Store: {flyer.store.name}</p>
    <p>Region: {flyer.region.name}, {flyer.region.country.name}</p>
  </Link>
</li>

          ))}
        </ul>
      )}
    </div>
  );
};

export default FlyerList;
