// src/pages/AddToCart.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import "./AddToCart.css";

const AddToCart = ({ userData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // ✅ Get user from props OR localStorage fallback
  const currentUser = userData || JSON.parse(localStorage.getItem("userData"));

  // ✅ Redirect to signin if no user
  useEffect(() => {
    if (!currentUser) {
      alert("Please sign in to view your cart.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // ✅ Load cart from backend
  const fetchCart = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${BASE_URL}/cart/`, {
        headers: { Authorization: `Token ${currentUser.token}` },
      });
      setCartItems(res.data); // expects array of cart items
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  // ✅ Add product to DB
  const addToCart = async (product) => {
    if (!currentUser) return;
    try {
      await axios.post(
        `${BASE_URL}/cart/add/`,
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Token ${currentUser.token}` } }
      );
      fetchCart(); // reload cart
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add product to cart.");
    }
  };

  // ✅ Update quantity in DB
  const handleQuantityChange = async (cartItemId, amount) => {
    if (!currentUser) return;
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + amount);
    try {
      await axios.patch(
        `${BASE_URL}/cart/${cartItemId}/`,
        { quantity: newQty },
        { headers: { Authorization: `Token ${currentUser.token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // ✅ Remove item from DB
  const handleRemove = async (cartItemId) => {
    if (!currentUser) return;
    try {
      await axios.delete(`${BASE_URL}/cart/${cartItemId}/`, {
        headers: { Authorization: `Token ${currentUser.token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // ✅ Subtotal
  const subtotal = cartItems
    .reduce((acc, item) => acc + Number(item.product.price || 0) * item.quantity, 0)
    .toFixed(2);

  // ✅ WhatsApp order
  const WHATSAPP_NUMBER = "918547409237";

  const buildWhatsAppLink = () => {
    let message = "🛒 Order Summary\n\n";
    cartItems.forEach((item) => {
      message += `${item.product.name} x${item.quantity} - ₹${(
        Number(item.product.price || 0) * item.quantity
      ).toFixed(2)}\n`;
    });
    message += `\nSubtotal: ₹${subtotal}\n👤 Ordered by: ${currentUser?.username}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  if (!currentUser) return <p>Redirecting to login...</p>;

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 {currentUser.username}'s Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.product.image || "https://via.placeholder.com/150"}
                  alt={item.product.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p className="price">₹ {Number(item.product.price || 0).toFixed(2)}</p>
                  <div className="cart-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      –
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      ✖
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ₹ {(Number(item.product.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cartItems.length}</p>
            <h3>Subtotal: ₹ {subtotal}</h3>

            <button
              className="checkout-btn"
              onClick={() => window.open(buildWhatsAppLink(), "_blank")}
            >
              Send Order via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
