// src/pages/AddToCart.js

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddToCart.css";

const AddToCart = ({ userData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // ✅ Get user from props OR localStorage fallback
  const currentUser =
    userData || JSON.parse(localStorage.getItem("userData"));

  // ✅ Redirect to signin if no user
  useEffect(() => {
    if (!currentUser) {
      alert("Please sign in to view your cart.");
      navigate("/"); // redirect home where signin modal exists
    }
  }, [currentUser, navigate]);

  // ✅ Load user-specific cart
  useEffect(() => {
    if (!currentUser) return;
    const savedCart =
      JSON.parse(localStorage.getItem(`cart_${currentUser.username}`)) || [];
    setCartItems(savedCart);
  }, [currentUser]);

  // ✅ Save user-specific cart
  const saveCart = (cart) => {
    if (!currentUser) return;
    localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
  };

  // ✅ Add product if passed via location.state
  useEffect(() => {
    if (!currentUser) return;
    const product = location.state?.product;
    if (!product) return;

    addToCart(product);
    navigate(location.pathname, { replace: true }); // clear state
  }, [location.state, location.pathname, navigate, currentUser]);

  const generateSlug = (product) => {
    if (product.slug) return product.slug;
    return `${product.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  };

  const addToCart = (product) => {
    const prod = { ...product, slug: generateSlug(product) };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.slug === prod.slug);
      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prev, { ...prod, quantity: 1 }];
      }
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const handleQuantityChange = (slug, amount) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const handleRemove = (slug) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.slug !== slug);
      saveCart(updated);
      return updated;
    });
  };

  // ✅ Subtotal rounded to 2 digits
  const subtotal = cartItems
    .reduce((acc, item) => acc + Number(item.price || 0) * item.quantity, 0)
    .toFixed(2);

  // ✅ Group items by store
  const groupedByStore = cartItems.reduce((acc, item) => {
    const storeSlug = item.store_slug || "unknown";
    if (!acc[storeSlug]) acc[storeSlug] = [];
    acc[storeSlug].push(item);
    return acc;
  }, {});

  // ✅ Single WhatsApp number
  const WHATSAPP_NUMBER = "918547409237";

  const buildWhatsAppLink = () => {
    let message = "🛒 Order Summary\n\n";

    Object.entries(groupedByStore).forEach(([storeSlug, products]) => {
      message += `Order from ${storeSlug}\n`;
      products.forEach((p) => {
        message += `${p.name} x${p.quantity} - ₹${(
          Number(p.price || 0) * p.quantity
        ).toFixed(2)}\n`;
      });
      message += "\n";
    });

    message += `Subtotal: ₹${subtotal}\n\n👤 Ordered by: ${currentUser?.username}`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  };

  if (!currentUser) {
    return <p>Redirecting to signin...</p>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 {currentUser.username}'s Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.slug}>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="store-name">
                    Store: {item.store_name || item.store_slug || "Unknown"}
                  </p>
                  <p className="price">
                    ₹ {Number(item.price || 0).toFixed(2)}
                  </p>
                  <div className="cart-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.slug, -1)}
                    >
                      –
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.slug, 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn remove-btn"
                      onClick={() => handleRemove(item.slug)}
                    >
                      ✖
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ₹ {(Number(item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cartItems.length}</p>
            <h3>Subtotal: ₹ {subtotal}</h3>

            {/* ✅ Single checkout button for all stores */}
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
