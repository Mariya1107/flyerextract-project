import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CropUploader = () => {
  const { flyerId } = useParams();
  const [flyer, setFlyer] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [canvasRef, setCanvasRef] = useState(null);
  const overlayRef = useRef();

  const startRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load flyer data
  useEffect(() => {
    axios.get("http://localhost:8000/api/flyers/all/").then((res) => {
      const flyer = res.data.find((f) => f.id === parseInt(flyerId));
      setFlyer(flyer);
    });
  }, [flyerId]);

  // After PDF render, store canvas ref
  const onRenderSuccess = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) setCanvasRef(canvas);
  };

  // Mouse handlers for crop
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

  const cropSelection = () => {
    if (!canvasRef || !selection) return;

    // Scale from visible overlay to actual canvas
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

    croppedCanvas.toBlob(async (blob) => {
      if (!blob) {
        alert("❌ Could not create image blob");
        return;
      }

      const formData = new FormData();
      formData.append("flyer_id", flyerId);
      formData.append("image", blob, "cropped.jpg");

      try {
        const res = await axios.post("http://localhost:8000/api/products/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(`✅ Uploaded: ${res.data.name} (₹${res.data.price})`);
      } catch (err) {
        alert("❌ Upload failed");
        console.error(err);
      }

      setSelection(null);
    }, "image/jpeg");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🖼️ Crop Product from Flyer</h2>

      {flyer?.pdf && (
        <>
          <div style={{ position: "relative", width: 600, margin: "auto" }}>
            <Document file={flyer.pdf} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              <Page pageNumber={currentPage} width={600} onRenderSuccess={onRenderSuccess} />
            </Document>

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
                height: canvasRef?.offsetHeight || 800,
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

          <div style={{ marginTop: 10, textAlign: "center" }}>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              ◀ Prev
            </button>
            <span style={{ margin: "0 15px" }}>Page {currentPage} / {numPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))} disabled={currentPage === numPages}>
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CropUploader;
