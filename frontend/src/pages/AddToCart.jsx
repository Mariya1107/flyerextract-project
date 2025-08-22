import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddToCart.css";

const AddToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // Add product if passed via location.state
  useEffect(() => {
    const product = location.state?.product;
    if (!product) return;

    addToCart(product);

    navigate(location.pathname, { replace: true });
  }, [location.state, location.pathname, navigate]);

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
      localStorage.setItem("cart", JSON.stringify(updatedCart));
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
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemove = (slug) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.slug !== slug);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Subtotal rounded to 2 digits
  const subtotal = cartItems
    .reduce((acc, item) => acc + Number(item.price || 0) * item.quantity, 0)
    .toFixed(2);

  const groupedByStore = cartItems.reduce((acc, item) => {
    const storeSlug = item.store_slug || "unknown";
    if (!acc[storeSlug]) acc[storeSlug] = [];
    acc[storeSlug].push(item);
    return acc;
  }, {});

  const storeNumbers = {
    lulu: "917025385200",
    nestle: "918547409237",
    unknown: "917025385200",
  };

  const buildWhatsAppLink = (storeSlug, products) => {
    const total = products
      .reduce((sum, p) => sum + Number(p.price || 0) * p.quantity, 0)
      .toFixed(2);
    const message =
      `🛒 Order from ${storeSlug}\n\n` +
      products
        .map(
          (p) =>
            `${p.name} x${p.quantity} - ₹${(
              Number(p.price || 0) * p.quantity
            ).toFixed(2)}`
        )
        .join("\n") +
      `\n\nSubtotal: ₹${total}`;
    const number = storeNumbers[storeSlug.toLowerCase()] || storeNumbers["unknown"];
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

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
                  <p className="price">₹ {Number(item.price || 0).toFixed(2)}</p>
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
            <div className="store-checkout">
              {Object.entries(groupedByStore).map(([storeSlug, products]) => (
                <button
                  key={storeSlug}
                  className="checkout-btn"
                  onClick={() =>
                    window.open(buildWhatsAppLink(storeSlug, products), "_blank")
                  }
                >
                  Send Order to {storeSlug}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
