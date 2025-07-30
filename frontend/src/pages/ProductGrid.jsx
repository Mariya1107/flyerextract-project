import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './ProductGrid.css';
import backendBaseURL from '../config'; // ✅ Import global backend URL

const ProductGrid = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendBaseURL}/api/products/search/`, {
        params: { q: searchQuery }
      })
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, [searchQuery]);

  return (
    <div className="grid-container">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
