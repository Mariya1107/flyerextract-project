import React from 'react';
import './ProductCard.css';
import backendBaseURL from '../config'; // ✅ import your base URL

const ProductCard = ({ product }) => {
  // ✅ If product.image is relative, prepend it with backendBaseURL
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${backendBaseURL}${product.image}`;

  return (
    <div className="product-card">
      <img
        src={imageUrl || "https://via.placeholder.com/150"}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <strong className="product-name">{product.name}</strong>
        <p className="product-price">Price {product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
