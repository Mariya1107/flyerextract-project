import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BASE_URL from '../config';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Import Bootstrap
import './FlyerList.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FlyerList = () => {
  const { id } = useParams();
  const [flyers, setFlyers] = useState([]);
  const [numPages, setNumPages] = useState({});

  useEffect(() => {
    axios
      .get(`${BASE_URL}/flyers/${id}/`)
      .then((res) => setFlyers(res.data))
      .catch((err) => console.error('Error fetching flyers:', err));
  }, [id]);

  const onDocumentLoadSuccess = (flyerId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [flyerId]: numPages }));
  };

  return (
    <div className="container my-5" >
      <h2 className="text-center mb-5 text-default fw-bold"> Latest Deals & Offers</h2>

      {flyers.length === 0 ? (
        <p className="text-center text-danger fs-5"> No flyers available in this region.</p>
      ) : (
        <div className="row g-5">
          {flyers.map((flyer) => (
            <div className="col-md-3 col-sm-6" key={flyer.id} >
              <div className="card shadow-sm h-100">
                <div className="card-img-top position-relative card_img">
                  {flyer.image ? (
                    <img style={{padding:"20px", width:"100%"}} src={flyer.image} alt={flyer.title} className="img-fluid rounded-top" />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center p-2 bg-light">
                      <Document
                        file={flyer.pdf}
                        onLoadSuccess={(pdf) => onDocumentLoadSuccess(flyer.id, pdf)}
                        loading={<span className="text-muted">Loading PDF...</span>}
                        error={<span className="text-danger">Failed to load PDF</span>}
                      >
                        <Page pageNumber={1} width={200} />
                      </Document>
                    </div>
                  )}
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2">🎁 Offer</span>
                </div>

                <div className="card-body text-center for_padding">
                  <h5 className="card-title">{flyer.title}</h5>
                  {/* <Link to={`/flyers/${flyer.id}`} className="btn btn-primary btn-sm me-2">
                    View Details
                  </Link> */}
                  <Link to={`/flyers/${flyer.id}`} className="btn for_btn btn-sm displayblock" >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlyerList;
