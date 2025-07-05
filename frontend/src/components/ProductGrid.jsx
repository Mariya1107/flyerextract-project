import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/products/search/', {
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
