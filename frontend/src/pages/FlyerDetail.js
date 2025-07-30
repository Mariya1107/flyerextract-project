import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "./CropProducts.css";
import "./ProductGrid.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ProductGrid = ({ products, onProductClick }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="product-section">
      <div className="product-header">
        <h2 className="section-title">Products</h2>
        {products.length > 3 && (
          <button
            className="toggle-view-btn"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less ▲" : "View All ▼"}
          </button>
        )}
      </div>

      <div className="product-grid">
        {products
          .slice(0, showAll ? products.length : visibleCount)
          .map((product, index) => (
            <div
              key={index}
              className="product-card"
              onClick={() => onProductClick(product)}
              style={{ cursor: "pointer" }}
            >
              <img src={product.image} alt={product.name} className="product-img" />
              <div className="product-details">
                <strong>{product.name}</strong>
                <div className="price-tag">₹ {product.price}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const FlyerDetail = () => {
  const { flyerId } = useParams();
  const navigate = useNavigate();

  const [flyer, setFlyer] = useState(null);
  const [canvasEl, setCanvasEl] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}flyers/all/`).then((res) => {
      const selected = res.data.find((f) => f.id === parseInt(flyerId));
      setFlyer(selected);

      if (!selected?.image && selected?.pdf) {
        const url = selected.pdf.startsWith("http")
          ? selected.pdf
          : `${BASE_URL}${selected.pdf}`;
        loadPdfDocument(url);
      }
    });

    axios.get(`${BASE_URL}products/${flyerId}/`).then((res) => setProducts(res.data));
  }, [flyerId]);

  const loadPdfDocument = async (url) => {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    setPdfDoc(pdf);
    setTotalPages(pdf.numPages);
    renderPdfPage(pdf, 1);
  };

  const renderPdfPage = async (pdf, pageNumber) => {
    const page = await pdf.getPage(pageNumber);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    setCanvasEl(canvas);
    const container = document.getElementById("pdf-canvas-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(canvas);
      canvas.style.width = "100%";
      canvas.style.display = "block";
    }
  };

  const goToPrev = () => {
    if (pdfDoc && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      renderPdfPage(pdfDoc, newPage);
    }
  };

  const goToNext = () => {
    if (pdfDoc && currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      renderPdfPage(pdfDoc, newPage);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowSearchModal(term.trim().length > 0);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flyer-detail-container">
      <div className="flyer-header-card">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>
        <input
          className="search-bar"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flyer-preview">
        <div id="pdf-canvas-container" style={{ width: "100%", position: "relative" }} />
        <div className="pdf-controls">
          <button onClick={goToPrev} disabled={currentPage <= 1}>
            ‹
          </button>
          <button onClick={goToNext} disabled={currentPage >= totalPages}>
            ›
          </button>
        </div>
      </div>

      <p className="page-info">
        Page {currentPage} / {totalPages}
      </p>

      <ProductGrid
        products={products}
        onProductClick={(product) => setSelectedProduct(product)}
      />

      {(showSearchModal || selectedProduct) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowSearchModal(false);
            setSelectedProduct(null);
          }}
        >
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close1"
              onClick={() => {
                setShowSearchModal(false);
                setSelectedProduct(null);
              }}
            >
              ✖
            </button>

            <h2>{selectedProduct ? "Product Details" : "Search Results"}</h2>

            {selectedProduct ? (
              <div className="product-grid-modal">
                <div className="product-card">
                  <img
                    src={selectedProduct.image || "https://via.placeholder.com/150"}
                    alt={selectedProduct.name}
                  />
                  <div className="product-details">
                    <strong>{selectedProduct.name}</strong>
                    <span className="price-tag">₹ {selectedProduct.price}</span>
                  </div>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="no-results">No matching products found.</p>
            ) : (
              <div className="product-grid-modal">
                {filteredProducts.map((p) => (
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
