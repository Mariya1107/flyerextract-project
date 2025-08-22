import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BASE_URL from '../config';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FlyerList.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FlyerList = () => {
  const { region_slug, store_slug } = useParams();
  const [flyers, setFlyers] = useState([]);
  const [numPages, setNumPages] = useState({});

  useEffect(() => {
    let url = '';

    if (region_slug) {
      url = `${BASE_URL}/flyers/${region_slug}/`;
    } else if (store_slug) {
      url = `${BASE_URL}/flyers/store/${store_slug}/`;
    }

    if (url) {
      axios
        .get(url)
        .then((res) => setFlyers(res.data.results || res.data || []))
        .catch((err) => console.error('Error fetching flyers:', err));
    }
  }, [region_slug, store_slug]);

  const onDocumentLoadSuccess = (flyerId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [flyerId]: numPages }));
  };

  const getFullUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 text-default fw-bold">Latest Deals & Offers</h2>

      {flyers.length === 0 ? (
        <p className="text-center text-danger fs-5">
          No flyers available in this region/store.
        </p>
      ) : (
        <div className="row g-5">
          {flyers.map((flyer) => {
            const imageUrl = getFullUrl(flyer.image);
            const pdfUrl = getFullUrl(flyer.pdf);

            return (
              <div className="col-md-3 col-sm-6" key={flyer.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-img-top position-relative card_img">
                    {imageUrl ? (
                      <img
                        style={{ padding: '20px', width: '100%' }}
                        src={imageUrl}
                        alt={flyer.title || 'Flyer'}
                        className="img-fluid rounded-top"
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : pdfUrl ? (
                      <div className="d-flex justify-content-center align-items-center p-2 bg-light">
                        <Document
                          file={pdfUrl}
                          onLoadSuccess={(pdf) => onDocumentLoadSuccess(flyer.id, pdf)}
                          loading={<span className="text-muted">Loading PDF...</span>}
                          error={<span className="text-danger">Failed to load PDF</span>}
                        >
                          <Page pageNumber={1} width={200} />
                        </Document>
                      </div>
                    ) : (
                      <div className="text-center p-3 text-muted">No image/PDF available</div>
                    )}
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      🎁 Offer
                    </span>
                  </div>

                  <div className="card-body text-center for_padding">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <h5 className="card-title mb-0">{flyer.title || 'Untitled Flyer'}</h5>
                      {flyer.expires_at && (
                        <span style={{ color: 'red', fontSize: '1rem' }}>
                          Expires: {new Date(flyer.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/flyers/${flyer.slug}/detail`}
                      className="btn for_btn btn-sm displayblock"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlyerList;
