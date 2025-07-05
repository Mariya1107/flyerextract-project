// components/ProductCard.jsx
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <strong className="product-name">{product.name}</strong>
        <p className="product-price">AED {product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
