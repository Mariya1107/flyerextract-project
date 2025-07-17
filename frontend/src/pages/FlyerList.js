import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../config'; // adjust the path if needed

const FlyerList = () => {
  const { store } = useParams(); // ✅ GET 'store' from route param
  const [flyers, setFlyers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFlyers() {
      try {
        const response = await axios.get(`${BASE_URL}/api/flyers/store/${store}/`);
        setFlyers(response.data);
      } catch (error) {
        console.error("Error fetching flyers:", error);
      }
    }

    if (store) {
      fetchFlyers();
    }
  }, [store]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Flyers for Store: {store}</h2>
      <div style={styles.grid}>
        {flyers.map((flyer) => (
          <div
            key={flyer.id}
            style={styles.card}
            onClick={() => navigate(`/flyers/${flyer.id}/`)}
          >
            <img
              src={flyer.thumbnail || flyer.image}
              alt={flyer.title}
              style={styles.image}
            />
            <div style={styles.title}>{flyer.title}</div>
            <button style={styles.btn}>View Flyer</button>
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
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#F9F9F9",
    borderRadius: "12px"
  },
  heading: {
    fontSize: "28px",
    marginBottom: "30px",
    textAlign: "center",
    color: "#333"
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
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    cursor: "pointer"
  },
  title: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "10px",
    color: "#444"
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
    cursor: "pointer",
    fontWeight: "500"
  }
};

export default FlyerList;
