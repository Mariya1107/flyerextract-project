import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../pages/Home.css";

const BrochureViewer = () => {
  const { id } = useParams();
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const cropperRef = useRef(null);

  // fetch page images
  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await axios.get(`/api/brochures/${id}/pages/`);
        setPages(res.data.pages);
        setActivePage(res.data.pages[0]);
      } catch (err) {
        console.error("Error fetching pages", err);
      }
    }
    fetchPages();
  }, [id]);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
    // send cropped image to backend or preview
    console.log("Cropped image", croppedDataUrl);
  };

  return (
    <div className="container section">
      <h2 className="text-center mb-4">Brochure #{id}</h2>

      {/* Thumbnails to switch pages */}
      <div className="page-thumb-bar mb-3">
        {pages.map((pg, idx) => (
          <img
            key={idx}
            src={pg.thumbnail_url || pg.url}
            alt={`Page ${idx + 1}`}
            className={`thumb ${pg.url === activePage?.url ? "active" : ""}`}
            onClick={() => setActivePage(pg)}
          />
        ))}
      </div>

      {activePage && (
        <Cropper
          src={activePage.url}
          style={{ height: 600, width: "100%" }}
          initialAspectRatio={0}
          guides={true}
          ref={cropperRef}
          viewMode={1}
        />
      )}

      <div className="text-center mt-3">
        <button onClick={handleCrop} className="btn btn-dark">
          Extract Region
        </button>
      </div>
    </div>
  );
};

export default BrochureViewer;
