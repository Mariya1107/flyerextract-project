import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const flagMap = {
  "Bahrain": "https://flagcdn.com/w320/bh.png",
  "Qatar": "https://flagcdn.com/w320/qa.png",
  "Kuwait": "https://flagcdn.com/w320/kw.png",
  "Oman": "https://flagcdn.com/w320/om.png",
  "Saudi Arabia": "https://flagcdn.com/w320/sa.png",
  "UAE": "https://flagcdn.com/w320/ae.png",
  "Egypt": "https://flagcdn.com/w320/eg.png",
};

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [flyers, setFlyers] = useState([]);
  const [showRegionOverlay, setShowRegionOverlay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/countries/")
      .then(res => setCountries(res.data));
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFlyers([]);
    setSelectedRegion(null);
    axios.get(`http://127.0.0.1:8000/api/regions/${country.id}/`)
      .then(res => {
        setRegions(res.data);
        setShowRegionOverlay(true);
      });
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region.id);
    setShowRegionOverlay(false);
    axios.get(`http://127.0.0.1:8000/api/flyers/${region.id}/`)
      .then(res => setFlyers(res.data));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}><span style={{ color: "#9F00FF" }}></span>FLYER VIEW</h1>
       
      </div>

      <div style={styles.title}>
        <h2 style={styles.subtitle}>Select your country</h2>
        <p style={styles.tagline}>Find all shopping flyers in one place</p>
      </div>

      <div style={styles.countryGrid}>
        {countries.map((country) => (
          <div
            key={country.id}
            onClick={() => handleCountrySelect(country)}
            style={{
              ...styles.countryCard,
              border: selectedCountry?.id === country.id ? "2px solid #9F00FF" : "1px solid #ccc"
            }}
          >
            <img
              src={flagMap[country.name] || "https://via.placeholder.com/120"}
              alt={country.name}
              style={styles.flag}
            />
            <div style={styles.countryName}>{country.name}</div>
          </div>
        ))}
      </div>

      {/* Region Overlay */}
      {showRegionOverlay && selectedCountry && (
        <div style={styles.overlay}>
          <div style={styles.regionPanel}>
            <div style={styles.regionHeader}>
              <h3 style={styles.dropdownTitle}>Select Region in {selectedCountry.name}</h3>
              <span style={styles.closeBtn} onClick={() => setShowRegionOverlay(false)}>✕</span>
            </div>
            <div style={styles.regionList}>
              {regions.map(region => (
                <div
                  key={region.id}
                  style={styles.regionItem}
                  onClick={() => handleRegionClick(region)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ccc"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  {region.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={styles.flyerGrid}>
        {flyers.map(f => (
          <div key={f.id} style={styles.flyerCard}>
            <h3 style={styles.flyerTitle}>{f.title}</h3>
            <p style={styles.flyerStore}>Store: {f.store.name}</p>
            <button
              style={styles.flyerButton}
              onClick={() => navigate(`/flyers/${f.id}`)}
            >
              View Products
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#F7F7F7",
    padding: "30px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "0 10px",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#9F00FF",
  },
  language: {
    fontSize: "14px",
    color: "#555",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "600",
  },
  tagline: {
    color: "#777",
  },
  countryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    maxWidth: "900px",
    margin: "0 auto 40px",
  },
  countryCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
  },
  flag: {
    width: "100px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  countryName: {
    marginTop: "10px",
    fontWeight: "500",
    color: "#333",
  },
  flyerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  flyerCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  flyerTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  flyerStore: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "12px",
  },
  flyerButton: {
    backgroundColor: "#9F00FF",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  // Overlay & Region panel styles
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  regionPanel: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  },
  regionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  dropdownTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
  },
  closeBtn: {
    fontSize: "20px",
    cursor: "pointer",
    color: "#555",
  },
  regionList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  regionItem: {
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default Home;
