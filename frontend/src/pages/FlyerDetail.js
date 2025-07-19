import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import BASE_URL from '../config';
import './FlyerDetail.css'; // External CSS

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FlyerDetail = () => {
  const { flyerId } = useParams();
  const navigate = useNavigate();
  const [flyer, setFlyer] = useState(null);
  const [products, setProducts] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = flyer?.title ? `Flyer | ${flyer.title}` : 'Flyer Detail';
  }, [flyer]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}flyers/all/`)
      .then(res => {
        const match = res.data.find(f => f.id === parseInt(flyerId));
        if (match) setFlyer(match);
        else setError('Flyer not found.');
      })
      .catch(() => setError('Failed to fetch flyer.'))
      .finally(() => setLoading(false));

    axios
      .get(`${BASE_URL}products/${flyerId}/`)
      .then(res => setProducts(res.data))
      .catch(() => console.error('Failed to fetch products.'));
  }, [flyerId]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 6);

  if (loading) return <p className="loading">⏳ Loading flyer details...</p>;
  if (error) return <p className="error">{error}</p>;

  return flyer ? (
    <div className="flyer-page">
      {/* Header */}
      <div className="flyer-header flyer-header-left">
        <button className="back-btn" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input1"
        />
      </div>

      {/* PDF Viewer or Image */}
      {flyer.pdf && flyer.pdf.endsWith('.pdf') ? (
        <>
          <div className="pdf-view-wrapper">
            <button
              className="arrow-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ◀
            </button>

            <div className="pdf-container">
              <Document
                file={{ url: flyer.pdf }}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<p>Loading PDF...</p>}
                onLoadError={(error) => {
                  console.error("PDF load error:", error.message);
                  alert("Error loading PDF.");
                }}
              >
                <Page
                  pageNumber={currentPage}
                  width={420}
                  onRenderSuccess={() => console.log(`Rendered page ${currentPage}`)}
                />
              </Document>
              <p className="page-info">Page {currentPage} / {numPages}</p>
            </div>

            <button
              className="arrow-btn"
              onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
              disabled={currentPage === numPages}
            >
              ▶
            </button>
          </div>
        </>
      ) : flyer.image ? (
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <img
            src={flyer.image}
            alt={flyer.title}
            style={{ width: '80%', maxWidth: '600px', borderRadius: '8px' }}
          />
        </div>
      ) : (
        <p className="error">❌ PDF or Image not available.</p>
      )}

      {/* Products Section */}
      <div className="products-header">
        <h2 className="section-title">Products</h2>
        {filteredProducts.length > 6 && (
          <button
            className="view-all-btn"
            onClick={() => setShowAll(prev => !prev)}
          >
            {showAll ? "Show Less ▲" : "View All ▼"}
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="subtext">No matching products found.</p>
      ) : (
        <div className={showAll ? "product-grid" : "product-row"}>
          {displayedProducts.map(p => (
            <div key={p.id} className="product-card">
              <img
                src={p.image || "https://via.placeholder.com/150"}
                alt={p.name}
                className="product-image"
              />
              <div className="product-info">
                <strong style={{ fontSize: "16px" }}>{p.name}</strong>
                <p style={{ color: "#555", margin: "6px 0 0" }}>Price {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Upload */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button
          className="add-btn"
          onClick={() => navigate(`/manual-upload/${flyerId}`)}
        >
          ➕ Add Product via Cropper
        </button>
      </div>
    </div>
  ) : null;
};

export default FlyerDetail;
