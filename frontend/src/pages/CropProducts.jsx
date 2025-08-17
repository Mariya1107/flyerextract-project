import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "./CropProducts.css";
import "./ProductGrid.css";
import { FaShoppingCart } from "react-icons/fa";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ProductGrid = ({ products, onProductClick, handleAddToCart }) => {
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
              <img
                src={product.image}
                alt={product.name}
                className="product-img"
              />
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

const CropProducts = () => {
  const { flyerId } = useParams();
  const navigate = useNavigate();

  const [flyer, setFlyer] = useState(null);
  const [canvasEl, setCanvasEl] = useState(null); // always store a canvas
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const startRef = useRef(null);
  const overlayRef = useRef();

  useEffect(() => {
    axios.get(`${BASE_URL}/flyers/all/`).then((res) => {
      const selected = res.data.find((f) => f.id === parseInt(flyerId));
      setFlyer(selected);

      if (selected?.pdf) {
        const url = selected.pdf.startsWith("http")
          ? selected.pdf
          : `${BASE_URL}/${selected.pdf}`;
        loadPdfDocument(url);
      } else if (selected?.image) {
        const imgUrl = selected.image.startsWith("http")
          ? selected.image
          : `${BASE_URL}/${selected.image}`;

        const img = new Image();
        img.crossOrigin = "anonymous"; // avoid CORS issues
        img.src = imgUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          setCanvasEl(canvas);

          const container = document.getElementById("pdf-canvas-container");
          if (container) {
            container.innerHTML = "";
            container.appendChild(canvas);
            canvas.style.maxWidth = "100%";
            canvas.style.display = "block";
          }
        };
      }
    });

    axios
      .get(`${BASE_URL}/products/${flyerId}/`)
      .then((res) => setProducts(res.data));
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

  const handleMouseDown = (e) => {
    const bounds = overlayRef.current.getBoundingClientRect();
    startRef.current = {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const bounds = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const { x: startX, y: startY } = startRef.current;

    setSelection({
      x: Math.min(startX, x),
      y: Math.min(startY, y),
      width: Math.abs(x - startX),
      height: Math.abs(y - startY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    cropSelection();
  };

  const cropSelection = async () => {
    if (!canvasEl || !selection || selection.width < 10 || selection.height < 10) {
      alert("❌ Invalid crop area.");
      return;
    }

    const scaleX = canvasEl.width / overlayRef.current.offsetWidth;
    const scaleY = canvasEl.height / overlayRef.current.offsetHeight;

    const sx = selection.x * scaleX;
    const sy = selection.y * scaleY;
    const sw = selection.width * scaleX;
    const sh = selection.height * scaleY;

    const cropped = document.createElement("canvas");
    cropped.width = sw;
    cropped.height = sh;
    const ctx = cropped.getContext("2d");
    ctx.drawImage(canvasEl, sx, sy, sw, sh, 0, 0, sw, sh);

    try {
      const blob = await new Promise((resolve, reject) => {
        cropped.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Empty blob"))),
          "image/jpeg"
        );
      });

      const formData = new FormData();
      formData.append("flyer_id", flyerId);
      formData.append("image", blob, "crop.jpg");

      const res = await axios.post(`${BASE_URL}/api/products/upload/`, formData);
      alert(`✅ Uploaded: ${res.data.name} (₹${res.data.price})`);
      setSelection(null);
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      alert("❌ Upload failed.");
    }
  };

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
        <div
          id="pdf-canvas-container"
          style={{ width: "100%", position: "relative" }}
        />
        <div
          ref={overlayRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "crosshair",
            zIndex: 10,
          }}
        >
          {selection && (
            <div
              style={{
                position: "absolute",
                left: selection.x,
                top: selection.y,
                width: selection.width,
                height: selection.height,
                border: "2px dashed red",
                backgroundColor: "rgba(255,0,0,0.2)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

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
                    <img
                      src={p.image || "https://via.placeholder.com/150"}
                      alt={p.name}
                    />
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

export default CropProducts;
