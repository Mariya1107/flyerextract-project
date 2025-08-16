// src/pages/AddToCart.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddToCart.css";

const AddToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add product if passed via location.state
  useEffect(() => {
    if (location.state?.product) {
      setCartItems((prevCart) => {
        const existingIndex = prevCart.findIndex(
          (item) => item.id === location.state.product.id
        );

        if (existingIndex !== -1) {
          // Increase quantity of existing product
          return prevCart.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new product with quantity = 1
          return [...prevCart, { ...location.state.product, quantity: 1 }];
        }
      });
    }
  }, [location.state]);

  const handleQuantityChange = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          {/* LEFT SIDE – CART ITEMS */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="store-name">
                    store: {item.storeName || "Unknown"}
                  </p>
                  <p className="price">₹ {item.price}</p>

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
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      ✖ Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  ₹ {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE – SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cartItems.length}</p>
            <h2>Subtotal: ₹ {subtotal}</h2>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
