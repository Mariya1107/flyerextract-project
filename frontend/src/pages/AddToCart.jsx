import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddToCart.css";

const AddToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [storeQueue, setStoreQueue] = useState([]); // ✅ queue of stores to checkout
  const [currentStore, setCurrentStore] = useState(null);

  useEffect(() => {
    if (location.state?.product) {
      const product = location.state.product;
      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id);

        let updatedCart;
        if (existingIndex !== -1) {
          updatedCart = prev.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...prev, { ...product, quantity: 1 }];
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

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

  // ✅ Begin checkout (prepare queue of stores)
  const beginCheckout = () => {
    if (cartItems.length === 0) return;

    const storeGroups = cartItems.reduce((acc, item) => {
      const store = item.store_name?.trim().toLowerCase() || "unknown";
      if (!acc[store]) acc[store] = [];
      acc[store].push(item);
      return acc;
    }, {});

    setStoreQueue(Object.entries(storeGroups));
    setCurrentStore(null);
  };

  // ✅ Send message to the current store
  const sendToCurrentStore = () => {
    if (!currentStore) return;

    const [store, products] = currentStore;
    const storeNumbers = {
      lulu: "917025385200",
      nestle: "918547409237",
    };

    const number = storeNumbers[store];
    if (!number) return;

    const message =
      `Hello ${store}, I'd like to order:\n\n` +
      products
        .map(
          (p) => `${p.name} x${p.quantity} - ₹${p.price * p.quantity}`
        )
        .join("\n") +
      `\n\nSubtotal: ₹${products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      )}`;

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // move to next store
    const nextQueue = [...storeQueue];
    nextQueue.shift();
    setStoreQueue(nextQueue);
    setCurrentStore(nextQueue.length > 0 ? nextQueue[0] : null);
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
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="store-name">
                    Store: {item.store_name || "Unknown"}
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

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cartItems.length}</p>
            <h2>Subtotal: ₹ {subtotal}</h2>

            {!currentStore && storeQueue.length === 0 && (
              <button className="checkout-btn" onClick={beginCheckout}>
                Proceed to Checkout → WhatsApp
              </button>
            )}

            {storeQueue.length > 0 && currentStore === null && (
              <button
                className="checkout-btn"
                onClick={() => setCurrentStore(storeQueue[0])}
              >
                Send to First Store
              </button>
            )}

            {currentStore && (
              <button className="checkout-btn" onClick={sendToCurrentStore}>
                Send to {currentStore[0]} → WhatsApp
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
