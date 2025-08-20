// src/pages/AddToCart.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddToCart.css";

const AddToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load cart from localStorage on first render
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // ✅ Handle product from location.state, merge with existing cart
  useEffect(() => {
    if (location.state?.product) {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = savedCart.findIndex(
        (item) => item.id === location.state.product.id
      );

      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = savedCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...savedCart, { ...location.state.product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);

      // ✅ Clear location.state to prevent re-adding on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  // ✅ Update localStorage whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleQuantityChange = (id, amount) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemove = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
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
                      className="btn remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      ✖ 
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
            <h3>Subtotal: ₹ {subtotal}</h3>
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
