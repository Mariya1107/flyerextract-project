import React from 'react';
import './ProductCard.css';
import { FaShoppingCart } from "react-icons/fa";
import backendBaseURL from '../config';

const ProductCard = ({ product }) => {
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
        
        {/* ✅ Flex container for price + cart icon */}
        <div className="product-footer">
          <p className="product-price">₹{product.price}</p>
          <FaShoppingCart className="cart-icon" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
