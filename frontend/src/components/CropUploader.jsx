import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import BASE_URL from "../config";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CropUploader = () => {
  const { flyerId } = useParams();
  const [flyer, setFlyer] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const startRef = useRef(null);
  const overlayRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    axios.get(`${BASE_URL}flyers/all/`).then((res) => {
      const flyer = res.data.find((f) => f.id === parseInt(flyerId));
      setFlyer(flyer);
    });
  }, [flyerId]);

  const onRenderSuccess = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) setCanvasRef(canvas);
  };

  const handleMouseDown = (e) => {
    const bounds = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    startRef.current = { x, y };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !startRef.current) return;
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
    if (!canvasRef || !selection) return;

    const scaleX = canvasRef.width / canvasRef.offsetWidth;
    const scaleY = canvasRef.height / canvasRef.offsetHeight;

    const sx = selection.x * scaleX;
    const sy = selection.y * scaleY;
    const sw = selection.width * scaleX;
    const sh = selection.height * scaleY;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = sw;
    croppedCanvas.height = sh;
    const ctx = croppedCanvas.getContext("2d");

    ctx.drawImage(canvasRef, sx, sy, sw, sh, 0, 0, sw, sh);

    const blob = await new Promise((resolve) =>
      croppedCanvas.toBlob(resolve, "image/jpeg")
    );

    if (!blob || blob.size === 0) {
      alert("❌ Could not create image blob");
      return;
    }

    const formData = new FormData();
    formData.append("flyer_id", flyerId);
    formData.append("image", blob, "cropped.jpg");

    try {
      const res = await axios.post(`${BASE_URL}api/products/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`✅ Uploaded: ${res.data.name} (₹${res.data.price})`);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }

    setSelection(null);
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    setCanvasRef(canvas);
    setImageLoaded(true);
  };

  const changePage = (offset) => {
    setPageNumber((prev) => Math.max(1, Math.min(prev + offset, numPages)));
    setSelection(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Crop Product from Flyer</h2>

      {flyer?.pdf || flyer?.image ? (
        <>
          <div
            ref={containerRef}
            style={{ position: "relative", width: 600, margin: "auto" }}
          >
            {flyer.pdf ? (
              <Document
                file={flyer.pdf}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={() => alert("❌ PDF not available")}
              >
                <Page
                  pageNumber={pageNumber}
                  width={600}
                  onRenderSuccess={onRenderSuccess}
                />
              </Document>
            ) : (
              <img
                src={
                  flyer.image.startsWith("http")
                    ? flyer.image
                    : `${BASE_URL}${flyer.image}`
                }
                alt="Flyer"
                crossOrigin="anonymous"
                style={{ width: 600 }}
                onLoad={handleImageLoad}
                onError={() => alert("❌ Image load failed")}
              />
            )}

            <div
              ref={overlayRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 600,
                height: containerRef.current?.offsetHeight || 800,
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
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          </div>

          {flyer.pdf && (
            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
              >
                ⬅️ Previous
              </button>
              <span>Page {pageNumber} of {numPages}</span>
              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
              >
                Next ➡️
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          ❌ No flyer (PDF or image) available.
        </p>
      )}
    </div>
  );
};

export default CropUploader;
