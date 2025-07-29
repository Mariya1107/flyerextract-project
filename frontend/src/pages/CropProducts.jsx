import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const CropProducts = () => {
  const { flyerId: paramFlyerId } = useParams();
  const location = useLocation();
  const stateFlyerId = location.state?.flyerId;
  const flyerId = paramFlyerId || stateFlyerId;

  const [flyer, setFlyer] = useState(null);
  const [canvasEl, setCanvasEl] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const startRef = useRef(null);
  const overlayRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!flyerId) return;

    axios.get(`${BASE_URL}flyers/all/`).then((res) => {
      const selected = res.data.find((f) => f.id === parseInt(flyerId));
      setFlyer(selected);

      if (!selected?.image && selected?.pdf) {
        const url = selected.pdf.startsWith("http") ? selected.pdf : `${BASE_URL}${selected.pdf}`;
        loadPdfDocument(url);
      }
    });
  }, [flyerId]);

  const loadPdfDocument = async (url) => {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      renderPdfPage(pdf, 1);
    } catch (err) {
      console.error("❌ PDF Load Error:", err);
      alert("Failed to load PDF.");
    }
  };

  const renderPdfPage = async (pdf, pageNumber) => {
    try {
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
        canvas.style.height = "auto";
        canvas.style.display = "block";
      }
    } catch (err) {
      console.error("❌ Page Render Error:", err);
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

  const handleImageLoad = (e) => {
    const img = e.target;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    setCanvasEl(canvas);
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
        cropped.toBlob((b) => (b ? resolve(b) : reject(new Error("Empty blob"))), "image/jpeg");
      });

      const formData = new FormData();
      formData.append("flyer_id", flyerId);
      formData.append("image", blob, "crop.jpg");

      const res = await axios.post(`${BASE_URL}api/products/upload/`, formData);
      alert(`✅ Uploaded: ${res.data.name} (₹${res.data.price})`);
      setSelection(null);
    } catch (err) {
      console.error("Crop/upload error:", err);
      alert("❌ Crop failed.");
    }
  };

  const renderOverlay = () => (
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
  );

  return (
    <div style={{ padding: "40px 20px", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        🖼️ Crop Product from Flyer
      </h2>

      {flyerId ? (
        flyer?.image || flyer?.pdf ? (
          <>
            <div
              ref={containerRef}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              {flyer?.image && (
                <img
                  src={
                    flyer.image.startsWith("http")
                      ? flyer.image
                      : `${BASE_URL}${flyer.image}`
                  }
                  alt="Flyer"
                  crossOrigin="anonymous"
                  style={{ width: "100%", display: "block", objectFit: "contain" }}
                  onLoad={handleImageLoad}
                  onError={() => alert("❌ Failed to load flyer image.")}
                />
              )}

              {!flyer?.image && flyer?.pdf && (
                <div id="pdf-canvas-container" style={{ width: "100%", height: "auto" }} />
              )}

              {renderOverlay()}
            </div>

            {!flyer?.image && flyer?.pdf && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button onClick={goToPrev} disabled={currentPage <= 1}>⬅️ Previous</button>
                <span style={{ margin: "0 12px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={goToNext} disabled={currentPage >= totalPages}>Next ➡️</button>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "crimson", textAlign: "center", fontSize: 16 }}>
            ❌ Flyer not available.
          </p>
        )
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>
          No flyer ID provided in route or state.
        </p>
      )}
    </div>
  );
};

export default CropProducts;
