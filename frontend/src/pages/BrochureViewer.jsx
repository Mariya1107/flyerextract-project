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
  const [loading, setLoading] = useState(true);
  const cropperRef = useRef(null);

  // Fetch pages of the brochure
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get(`/api/brochures/${id}/pages/`);
        if (res.data.pages.length > 0) {
          setPages(res.data.pages);
          setActivePage(res.data.pages[0]);
        }
      } catch (err) {
        console.error("Error fetching brochure pages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [id]);

  // Handle crop and preview or send
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
    console.log("🖼️ Cropped Image Data URL:", croppedDataUrl);

    // Optional: send to backend here
    // const blob = await (await fetch(croppedDataUrl)).blob();
    // const formData = new FormData();
    // formData.append("cropped_image", blob);
    // await axios.post("/api/upload-cropped/", formData);
  };

  return (
    <div className="container section">
      <h2 className="text-center mb-4">Brochure #{id}</h2>

      {loading ? (
        <p className="text-center">Loading pages...</p>
      ) : pages.length === 0 ? (
        <p className="text-center text-danger">No pages found.</p>
      ) : (
        <>
          <div className="page-thumb-bar mb-3 d-flex gap-2 flex-wrap justify-content-center">
            {pages.map((pg, idx) => (
              <img
                key={idx}
                src={pg.thumbnail_url || pg.url}
                alt={`Page ${idx + 1}`}
                className={`thumb ${pg.url === activePage?.url ? "active" : ""}`}
                onClick={() => setActivePage(pg)}
                style={{ height: "80px", cursor: "pointer", border: pg.url === activePage?.url ? "2px solid #000" : "1px solid #ccc" }}
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
              background={false}
            />
          )}

          <div className="text-center mt-3">
            <button onClick={handleCrop} className="btn btn-dark">
              Extract Region
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BrochureViewer;
