// src/pages/FlyerDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "./CropProducts.css";
import "./ProductGrid.css";
import { FaShoppingCart } from "react-icons/fa";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// --------------------------- Product Grid ---------------------------
const ProductGrid = ({ products, onProductClick, handleAddToCart }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAll, setShowAll] = useState(false);

  const getImageUrl = (image) =>
    !image ? "" : image.startsWith("http") ? image : `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;

  return (
    <div className="product-section">
      <div className="product-header">
        <h2 className="section-title">Products</h2>
        {products.length > visibleCount && (
          <button className="toggle-view-btn" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? "Show Less ▲" : "View All ▼"}
          </button>
        )}
      </div>

      <div className="product-grid">
        {products.slice(0, showAll ? products.length : visibleCount).map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => onProductClick(product)}
            style={{ cursor: "pointer" }}
          >
            <img src={getImageUrl(product.image)} alt={product.name} className="product-img" />
            <div className="product-details">
              <strong>{product.name}</strong>
              <div className="product-footer">
                <span className="price-tag">₹ {product.price}</span>
                <FaShoppingCart
                  className="cart-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --------------------------- Flyer Detail Page ---------------------------
const FlyerDetail = () => {
  const { flyer_slug } = useParams();
  const navigate = useNavigate();

  const [flyer, setFlyer] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getFileUrl = (file) =>
    !file ? "" : file.startsWith("http") ? file : `${BASE_URL}${file.startsWith("/") ? "" : "/"}${file}`;

  // ---------------- Fetch Flyer & Products ----------------
  useEffect(() => {
    const fetchFlyer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/flyers/slug/${flyer_slug}/`);
        setFlyer(res.data);

        if (!res.data.image && res.data.pdf) {
          loadPdfDocument(getFileUrl(res.data.pdf));
        }
      } catch (err) {
        console.error("Error fetching flyer:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/${flyer_slug}/`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchFlyer();
    fetchProducts();
  }, [flyer_slug]);

  // ---------------- PDF Handling ----------------
  const loadPdfDocument = async (url) => {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      renderPdfPage(pdf, 1);
    } catch (err) {
      console.error("Failed to load PDF:", err);
    }
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

    const container = document.getElementById("pdf-canvas-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(canvas);

      // ✅ Match flyer image styling
      canvas.style.width = "100%";
      canvas.style.maxHeight = "1000px";
      canvas.style.objectFit = "contain";
      canvas.style.borderRadius = "12px";
      canvas.style.display = "block";
      canvas.style.margin = "0 auto";
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

  // ---------------- Search & Cart ----------------
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowSearchModal(term.trim().length > 0);
  };

  const handleAddToCart = (product) => {
    navigate("/cart", { state: { product } });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------- Render ----------------
  return (
    <div className="container">
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
        {flyer?.image ? (
          <img
            src={getFileUrl(flyer.image)}
            alt={flyer.title}
            style={{ width: "100%", maxHeight: "1000px", objectFit: "contain", borderRadius: "12px" }}
          />
        ) : flyer?.pdf ? (
          <>
            <div
              id="pdf-canvas-container"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <div className="pdf-controls">
              <button onClick={goToPrev} disabled={currentPage <= 1}>
                ‹
              </button>
              <button onClick={goToNext} disabled={currentPage >= totalPages}>
                ›
              </button>
            </div>
          </>
        ) : (
          <p>No flyer image or PDF available.</p>
        )}
      </div>

      {pdfDoc && (
        <p className="page-info">
          Page {currentPage} / {totalPages}
        </p>
      )}

      <ProductGrid
        products={products}
        onProductClick={(product) => setSelectedProduct(product)}
        handleAddToCart={handleAddToCart}
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

            <h2 style={{ color: "#000" }}>
              {selectedProduct ? "Product Details" : "Search Results"}
            </h2>

            {selectedProduct ? (
              <div className="product-grid-modal">
                <div className="product-card">
                  <img src={getFileUrl(selectedProduct.image)} alt={selectedProduct.name} />
                  <div className="product-details">
                    <strong>{selectedProduct.name}</strong>
                    <div className="product-footer">
                      <span className="price-tag">₹ {selectedProduct.price}</span>
                      <FaShoppingCart
                        className="cart-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(selectedProduct);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="no-results">No matching products found.</p>
            ) : (
              <div className="product-grid-modal">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="product-card">
                    <img src={getFileUrl(p.image)} alt={p.name} />
                    <div className="product-details">
                      <strong>{p.name}</strong>
                      <div className="product-footer">
                        <span className="price-tag">₹ {p.price}</span>
                        <FaShoppingCart
                          className="cart-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p);
                          }}
                        />
                      </div>
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
