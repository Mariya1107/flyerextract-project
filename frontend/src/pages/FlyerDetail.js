import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import BASE_URL from '../config';
import './FlyerDetail.css';

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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = flyer?.title ? `Flyer | ${flyer.title}` : 'Flyer Detail';
  }, [flyer]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}flyers/all/`)
      .then(res => {
        const match = res.data.find(f => f.id === parseInt(flyerId));
        if (match) setFlyer(match);
        else setError('Flyer not found.');
      })
      .catch(() => setError('Failed to fetch flyer.'))
      .finally(() => setLoading(false));

    axios.get(`${BASE_URL}products/${flyerId}/`)
      .then(res => setProducts(res.data))
      .catch(() => console.error('Failed to fetch products.'));
  }, [flyerId]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProducts = products.slice(0, showAll ? products.length : 3);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSearchModal(e.target.value.trim().length > 0);
  };

  if (loading) {
    return (
      <div className="flyer-loading">
        <div className="spinner" />
        <p>Loading flyer details...</p>
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="flyer-detail-container">
      {/* Header */}
      <div className="flyer-header-card">
        <button className="back-button" onClick={() => navigate("/")}>← Back</button>
        <input
          className="search-bar animated-search"
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

    {/* Flyer Display */}
<div className="flyer-preview">
  {flyer?.pdf?.endsWith('.pdf') ? (
    <Document
      file={{ url: flyer.pdf }}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      className="pdf-doc"
    >
      <Page
        pageNumber={currentPage}
        width={350}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </Document>
  ) : flyer.image ? (
    <img src={flyer.image} alt="Flyer" className="flyer-img" />
  ) : (
    <p className="error">PDF or image not available.</p>
  )}

  {/* Only arrow buttons here */}
  <div className="pdf-controls">
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage <= 1}
    >
      ‹
    </button>
    <button
      onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
      disabled={currentPage >= numPages}
    >
      ›
    </button>
  </div>
</div>

{/* Page number below the flyer */}
<p className="page-info">
  Page {currentPage} / {numPages}
</p>

      {/* Products Section */}
      <div className="product-section">
        <div className="product-header">
          <h2>Products</h2>
          {products.length > 3 && (
            <button className="toggle-view-btn" onClick={() => setShowAll(prev => !prev)}>
              {showAll ? 'Show Less ▲' : 'View All ▼'}
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <p className="no-results">No products found in this flyer.</p>
        ) : (
          <div className="product-grid">
            {displayedProducts.map(p => (
              <div key={p.id} className="product-card">
                <img src={p.image || "https://via.placeholder.com/150"} alt={p.name} />
                <div className="product-details">
                  <strong>{p.name}</strong>
                  <span className="price-tag">₹ {p.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    

      {/* Search Results Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close1" onClick={() => setShowSearchModal(false)}>✖</button>
            <h2>Search Results</h2>
            {filteredProducts.length === 0 ? (
              <p className="no-results">No matching products found.</p>
            ) : (
              <div className="product-grid-modal">
                {filteredProducts.map(p => (
                  <div key={p.id} className="product-card">
                    <img src={p.image || "https://via.placeholder.com/150"} alt={p.name} />
                    <div className="product-details">
                      <strong>{p.name}</strong>
                      <span className="price-tag">₹ {p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyerDetail;
