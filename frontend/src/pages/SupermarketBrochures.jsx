// src/pages/SupermarketBrochures.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../pages/Home.css";

const SupermarketBrochures = () => {
  const { id } = useParams();
  const [brochures, setBrochures] = useState([]);

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const res = await axios.get(`/api/supermarket/${id}/brochures/`);
        setBrochures(res.data);
      } catch (err) {
        console.error("Error fetching brochures:", err);
      }
    };
    fetchBrochures();
  }, [id]);

  return (
    <div className="container section">
      <h2 className="text-center mb-4">
        Brochures for Supermarket <span className="text-linear-primary">#{id}</span>
      </h2>
      <div className="category-grid">
        {brochures.map((brochure) => (
          <div key={brochure.id} className="category-card">
            <img
              src={brochure.thumbnail_url || "/assets/img/icons/category-01.svg"}
              alt={brochure.title}
              className="img-fluid"
            />
            <h6>{brochure.title}</h6>
            <p>{brochure.pages.length} Pages</p>
            <Link to={`/brochure/${brochure.id}`} className="hover-link">
              View Brochure
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupermarketBrochures;
