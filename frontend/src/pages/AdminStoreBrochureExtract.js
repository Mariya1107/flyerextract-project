import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./FlyerList.css";
import "./UsersAdminDash.css";
import BASE_URL from "../config";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AdminStoreBrochureExtract = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [brochures, setBrochures] = useState([]);
  const [numPages, setNumPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const token =
          localStorage.getItem("adminToken") || localStorage.getItem("token");

        if (!token) {
          setError("⚠️ No admin token found. Redirecting to login...");
          setLoading(false);
          navigate("/admin-login");
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/stores-with-flyers/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const store = res.data.find((s) => s.id === parseInt(storeId));
        setBrochures(store ? store.flyers : []);
      } catch (err) {
        console.error("Error fetching brochures:", err);
        if (err.response?.status === 401) {
          setError("❌ Unauthorized. Please log in again.");
          navigate("/admin-login");
        } else {
          setError("❌ Failed to fetch brochures. Server error.");
        }
        setBrochures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrochures();
  }, [storeId, navigate]);

  const onDocumentLoadSuccess = (brochureId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [brochureId]: numPages }));
  };

  return (
    <div className="flyer-list-wrapper">
      <div className="table-header">
        <h2 className="dashboard-title">Store Brochure Extracts</h2>
      </div>

      {loading ? (
        <p>⏳ Loading brochures...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : brochures.length === 0 ? (
        <p className="no-flyers">🚫 No brochures available for this store.</p>
      ) : (
        <div className="flyer-grid">
          {brochures.map((brochure) => (
            <div key={brochure.id} className="flyer-card fade-in">
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {brochure.image ? (
                    <img
                      src={
                        brochure.image.startsWith("http")
                          ? brochure.image
                          : `${BASE_URL}/${brochure.image}`
                      }
                      alt={brochure.title || "Brochure"}
                      className="flyer-img"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/240x300?text=No+Image")
                      }
                    />
                  ) : brochure.pdf ? (
                    <div className="pdf-container">
                      <Document
                        file={brochure.pdf}
                        onLoadSuccess={(pdf) =>
                          onDocumentLoadSuccess(brochure.id, pdf)
                        }
                        loading="Loading PDF..."
                      >
                        <Page pageNumber={1} width={240} />
                      </Document>
                    </div>
                  ) : (
                    <p>No preview available</p>
                  )}

                  <div className="flyer-hover-overlay">
                    <Link to={`/admin-dashboard/crop-products/${brochure.id}`}>
                      <button className="flyer-hover-btn">Crop</button>
                    </Link>
                  </div>
                </div>
                <span className="flyer-tag">📌 Brochure</span>
              </div>

              <div className="flyer-info">
                <strong>{brochure.title || "Untitled Brochure"}</strong>
                <button className="flyer-view-btn" disabled>
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStoreBrochureExtract;
