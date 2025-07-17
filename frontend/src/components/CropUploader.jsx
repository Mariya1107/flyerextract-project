import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

const CropUploader = () => {
  const { flyerId } = useParams();
  const [flyer, setFlyer] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef(null);
  const overlayRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    axios.get(`${BASE_URL}flyers/all/`).then((res) => {
      const flyer = res.data.find((f) => f.id === parseInt(flyerId));
      setFlyer(flyer);
    });
  }, [flyerId]);

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

  const handleImageLoad = (e) => {
    const img = e.target;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    setCanvasRef(canvas);
  };

  const cropSelection = async () => {
    try {
      if (!canvasRef || !selection || selection.width < 10 || selection.height < 10) {
        alert("❌ Invalid crop selection. Try selecting a bigger area.");
        return;
      }

      const scaleX = canvasRef.width / overlayRef.current.offsetWidth;
      const scaleY = canvasRef.height / overlayRef.current.offsetHeight;

      const sx = selection.x * scaleX;
      const sy = selection.y * scaleY;
      const sw = selection.width * scaleX;
      const sh = selection.height * scaleY;

      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = sw;
      croppedCanvas.height = sh;
      const ctx = croppedCanvas.getContext("2d");

      ctx.drawImage(canvasRef, sx, sy, sw, sh, 0, 0, sw, sh);

      const blob = await new Promise((resolve, reject) => {
        croppedCanvas.toBlob((b) => {
          if (!b || b.size === 0) reject(new Error("Blob is empty"));
          else resolve(b);
        }, "image/jpeg");
      });

      const formData = new FormData();
      formData.append("flyer_id", flyerId);
      formData.append("image", blob, "cropped.jpg");

      const res = await axios.post(`${BASE_URL}api/products/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`✅ Uploaded: ${res.data.name} (₹${res.data.price})`);
      setSelection(null);
    } catch (err) {
      console.error("❌ Error creating/uploading blob:", err);
      alert("❌ Crop failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Crop Product from Flyer</h2>

      {flyer?.image ? (
        <div
          ref={containerRef}
          style={{ position: "relative", width: 600, margin: "auto" }}
        >
          <img
            src={flyer.image.startsWith("http") ? flyer.image : `${BASE_URL}${flyer.image}`}
            alt="Flyer"
            crossOrigin="anonymous"
            style={{ width: 600 }}
            onLoad={handleImageLoad}
            onError={() => alert("❌ Failed to load flyer image")}
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
      ) : (
        <p style={{ color: "red", textAlign: "center" }}>❌ Flyer image not available.</p>
      )}
    </div>
  );
};

export default CropUploader;
