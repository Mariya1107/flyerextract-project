import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FlyerList = () => {
  const [flyers, setFlyers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/flyers/all/")
      .then(res => setFlyers(res.data))
      .catch(err => console.error("Error fetching flyers:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📄 Available Brochures</h2>
      <div style={styles.grid}>
        {flyers.map(f => (
          <div key={f.id} style={styles.card}>
            <p style={styles.title}>{f.title}</p>
            <img
              src={f.thumbnail || "https://via.placeholder.com/200x280?text=No+Preview"}
              alt={f.title}
              style={styles.image}
            />
            <button style={styles.btn} onClick={() => navigate(`/flyers/${f.id}`)}>
              View Flyer →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "auto",
    fontFamily: "Segoe UI, sans-serif"
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
    textAlign: "center"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  title: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "10px"
  },
  image: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    borderRadius: "8px"
  },
  btn: {
    marginTop: "10px",
    padding: "10px 16px",
    backgroundColor: "#9F00FF",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default FlyerList;
