import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ProductSearchResults = () => {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    if (query) {
      axios.get(`http://127.0.0.1:8000/api/products/search/?q=${query}`)
        .then(res => setResults(res.data))
        .catch(err => console.error('Search error:', err));
    }
  }, [query]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🔍 Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p style={styles.noResult}>No matching products found.</p>
      ) : (
        <div style={styles.grid}>
          {results.map(p => (
            <div key={p.id} style={styles.card}>
              <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} style={styles.image} />
              <div style={styles.info}>
                <strong>{p.name}</strong>
                <p style={styles.price}>AED {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '30px', fontFamily: "'Segoe UI', sans-serif" },
  title: { fontSize: '24px', marginBottom: '20px' },
  noResult: { fontSize: '16px', color: '#999' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' },
  image: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' },
  info: { marginTop: '10px' },
  price: { color: '#555', marginTop: '4px' },
};

export default ProductSearchResults;
