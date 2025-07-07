import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

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

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/flyers/all/').then(res => {
      const match = res.data.find(f => f.id === parseInt(flyerId));
      if (match) setFlyer(match);
    });

    axios.get(`http://127.0.0.1:8000/api/products/${flyerId}/`).then(res => {
      setProducts(res.data);
    });
  }, [flyerId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < numPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 6);

  return flyer ? (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>FLYER VIEW</h1>
        <div style={styles.rightHeader}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            ⬅ Back to Home
          </button>
        </div>
      </div>

      {/* Flyer Info */}
      <div style={styles.flyerInfo}>
        <h2 style={styles.flyerTitle}>{flyer.title}</h2>
        <p style={styles.subtext}>
          <strong>Store:</strong> {flyer.store.name}
        </p>
      </div>

      {/* PDF Viewer */}
{flyer?.pdf && flyer.pdf.endsWith('.pdf') ? (
  <>
    <div style={styles.pdfContainer}>
      <Document
        file={{ url: flyer.pdf }}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          console.log("PDF loaded with", numPages, "pages");
        }}
        loading={<p>Loading PDF...</p>}
        onLoadError={(error) => {
          console.error("PDF load error:", error.message);
          alert("Error loading PDF.");
        }}
      >
        {[...Array(numPages)].map((_, index) =>
          index + 1 === currentPage ? (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={420}
              onRenderSuccess={() => console.log(`✅ Rendered page ${index + 1}`)}
            />
          ) : null
        )}
      </Document>
    </div>

    {numPages > 1 && (
      <div style={styles.pdfNav}>
        <button
          style={styles.navBtn}
          onClick={() => {
            console.log("⬅ Going to page", currentPage - 1);
            setCurrentPage((p) => Math.max(1, p - 1));
          }}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span style={styles.pageInfo}>Page {currentPage} / {numPages}</span>
        <button
          style={styles.navBtn}
          onClick={() => {
            console.log("➡ Going to page", currentPage + 1);
            setCurrentPage((p) => Math.min(numPages, p + 1));
          }}
          disabled={currentPage === numPages}
        >
          Next ▶
        </button>
      </div>
    )}
  </>
) : (
  <p style={styles.error}>⚠️ PDF not available or invalid.</p>
)}


      {/* Product Section */}
      <div style={styles.productsHeader}>
        <h2 style={styles.sectionTitle}>🛍️ Products</h2>
        {filteredProducts.length > 6 && (
          <button
            style={styles.viewAllBtn}
            onClick={() => setShowAll(prev => !prev)}
          >
            {showAll ? "Show Less ▲" : "View All ▼"}
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <p style={styles.subtext}>No matching products found.</p>
      ) : (
        <div style={showAll ? styles.productGrid : styles.productRow}>
          {displayedProducts.map(p => (
            <div key={p.id} style={styles.productCard}>
              <img
                src={p.image || "https://via.placeholder.com/150"}
                alt={p.name}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <strong style={{ fontSize: "16px" }}>{p.name}</strong>
                <p style={{ color: "#555", margin: "6px 0 0" }}>Price {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Uploader */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button
          style={styles.addBtn}
          onClick={() => navigate(`/manual-upload/${flyerId}`)}
        >
          ➕ Add Product via Cropper
        </button>
      </div>
    </div>
  ) : (
    <p style={{ padding: '30px', fontSize: '18px' }}>
      ⏳ Loading flyer details...
    </p>
  );
};

const styles = {
  page: {
    padding: "30px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#F9F9F9",
    borderRadius: "10px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  rightHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  backBtn: {
    backgroundColor: "#e0e0e0",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  searchInput: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "180px",
  },
  flyerInfo: {
    textAlign: "center",
    marginBottom: "20px",
  },
  flyerTitle: {
    fontSize: "26px",
    color: "#444",
  },
  subtext: {
    fontSize: "15px",
    color: "#666",
  },
  pdfContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: "30px 0",
    minHeight: "70vh",
  },
  pdfNav: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  navBtn: {
    padding: "8px 16px",
    backgroundColor: "#9F00FF",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#444",
  },
  productsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "50px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "22px",
    color: "#333",
  },
  viewAllBtn: {
    fontSize: "14px",
    backgroundColor: "transparent",
    border: "none",
    color: "#9F00FF",
    cursor: "pointer",
    fontWeight: "500",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  productRow: {
    display: "flex",
    overflowX: "auto",
    gap: "20px",
    paddingBottom: "10px",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "10px",
    minWidth: "180px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  productImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  productInfo: {
    textAlign: "center",
  },
  addBtn: {
    backgroundColor: "#9F00FF",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: {
    color: "crimson",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default FlyerDetail;
