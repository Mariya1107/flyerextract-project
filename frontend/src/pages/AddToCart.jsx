// src/pages/AddToCart.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AddToCart.css";
import Authorisation from "../components/Authorisation";
import BASE_URL from "../config";

const AddToCart = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const token = localStorage.getItem("token");

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  // WhatsApp phone number state
  const [phoneInput, setPhoneInput] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  // ---------------- Helpers for CART_SLUG ----------------
  const getCartSlug = () => localStorage.getItem("cartSlug");
  const setCartSlug = (slug) => localStorage.setItem("cartSlug", slug);

  let CART_SLUG = getCartSlug();
  if (!CART_SLUG) {
    CART_SLUG = `cart-${Date.now()}`;
    setCartSlug(CART_SLUG);
  }

  // ---------------- Load cart from localStorage ----------------
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // ---------------- Fetch cart from backend ----------------
  useEffect(() => {
    const fetchCartFromDB = async () => {
      if (!currentUser || !token) return;

      try {
        const latestSlug = getCartSlug();
        const res = await fetch(`${BASE_URL}/api/accounts/cart/${latestSlug}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const mappedItems = (data.items || []).map((item) => ({
            slug: item.slug,
            id: item.product?.id,
            name: item.product?.name || "Unnamed Product",
            price: item.product?.price || 0,
            quantity: item.quantity,
            total_price:
              item.total_price || item.quantity * (item.product?.price || 0),
            store_name: item.store_name || "Unknown",
            store_slug: item.store_slug || "unknown",
            image: item.product?.image || "https://via.placeholder.com/150",
          }));
          setCartItems(mappedItems);
          localStorage.setItem("cart", JSON.stringify(mappedItems));
        } else {
          console.error("Failed to fetch cart", res.status);
        }
      } catch (err) {
        console.error("Error fetching cart", err);
      }
    };

    fetchCartFromDB();
  }, [currentUser, token]);

  // ---------------- Save cart to localStorage ----------------
  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // ---------------- Add product from location.state ----------------
  useEffect(() => {
    const product = location.state?.product;
    if (!product) return;

    addToCart(product);
    window.history.replaceState({}, document.title);
  }, [location.state]);

  const generateSlug = (product) => {
    if (product.slug) return product.slug;
    return `${product.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  };

  const addToCart = (product) => {
    const prod = {
      ...product,
      slug: generateSlug(product),
      store_name: product.store_name || product.store?.name || "Unknown",
      store_slug: product.store_slug || product.store?.slug || "unknown",
      image: product.image || "https://via.placeholder.com/150",
    };

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

      if (currentUser && token) {
        // Always use the latest slug from localStorage
        syncCartItemToDB(prod, 1, getCartSlug());
      }
      return updatedCart;
    });
  };

  const handleQuantityChange = (slug, amount) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.slug === slug
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0);
      saveCart(updated);

      if (currentUser && token) {
        const item = updated.find((i) => i.slug === slug);
        if (item) updateCartItemInDB(item.slug, item.quantity);
        else removeCartItemFromDB(slug);
      }

      return updated;
    });
  };

  const handleRemove = (slug) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.slug !== slug);
      saveCart(updated);

      if (currentUser && token) removeCartItemFromDB(slug);

      return updated;
    });
  };

  // ---------------- API Calls ----------------
  const syncCartItemToDB = async (product, qty, cartSlug) => {
    try {
      await fetch(`${BASE_URL}/api/accounts/cart/${cartSlug}/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: qty,
        }),
      });
    } catch (err) {
      console.error("Error syncing cart to DB", err);
    }
  };

  const updateCartItemInDB = async (itemSlug, qty) => {
    try {
      await fetch(`${BASE_URL}/api/accounts/cart/item/${itemSlug}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ quantity: qty }),
      });
    } catch (err) {
      console.error("Error updating cart item", err);
    }
  };

  const removeCartItemFromDB = async (itemSlug) => {
    try {
      await fetch(`${BASE_URL}/api/accounts/cart/item/${itemSlug}/remove/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    } catch (err) {
      console.error("Error removing cart item", err);
    }
  };

  const syncLocalCartToDB = async () => {
    if (!currentUser || !token) return;
    const latestSlug = getCartSlug();
    for (const item of cartItems) {
      await syncCartItemToDB(item, item.quantity, latestSlug);
    }
  };

  const checkoutAndCreateNewCart = async () => {
    // If logged in, tell backend to checkout current cart and return a fresh cart
    if (currentUser && token) {
      try {
        const latestSlug = getCartSlug();
        const res = await fetch(
          `${BASE_URL}/api/accounts/cart/${latestSlug}/checkout/`,
          {
            method: "POST",
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const newSlug =
            data?.new_cart?.slug || `cart-${Date.now()}`; // fallback
          setCartSlug(newSlug);
          return newSlug;
        }
      } catch (e) {
        console.error("Checkout failed, falling back to local slug", e);
      }
    }
    // Guest users (or on failure): just roll a new local slug
    const fallback = `cart-${Date.now()}`;
    setCartSlug(fallback);
    return fallback;
  };

  const resetLocalCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // ---------------- Subtotal & Grouping ----------------
  const subtotal = cartItems
    .reduce(
      (acc, item) =>
        acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    )
    .toFixed(2);

  const groupedByStore = cartItems.reduce((acc, item) => {
    const storeSlug = item.store_slug || "unknown";
    if (!acc[storeSlug]) acc[storeSlug] = [];
    acc[storeSlug].push(item);
    return acc;
  }, {});

  // ---------------- WhatsApp ----------------
  const buildWhatsAppLink = (number) => {
    let message = "🛒 Order Summary\n\n";

    Object.entries(groupedByStore).forEach(([storeSlug, products]) => {
      message += `Order from ${products[0].store_name || storeSlug}\n`;
      products.forEach((p) => {
        message += `${p.name} x${p.quantity} - ₹${(
          Number(p.price || 0) * Number(p.quantity || 0)
        ).toFixed(2)}\n`;
      });
      message += "\n";
    });

    message += `Subtotal: ₹${subtotal}\n\n👤 Ordered by: ${
      currentUser?.username || "Guest"
    }`;

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  // ---------------- Checkout ----------------
  const handleCheckout = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      setAuthMode("signin");
      return;
    }

    setShowPhoneInput(true);
  };

  const confirmSendWhatsApp = async () => {
    if (!phoneInput) {
      alert("Please enter a valid WhatsApp number");
      return;
    }

    // 1) Sync local cart to backend (safe-guard)
    await syncLocalCartToDB();

    // 2) Deactivate old cart and create a fresh one; store new slug
    await checkoutAndCreateNewCart();

    // 3) Clear local cart state/storage
    resetLocalCart();

    // 4) Open WhatsApp
    window.open(buildWhatsAppLink(phoneInput), "_blank");

    // 5) UI reset
    setShowPhoneInput(false);
    setPhoneInput("");
  };

  // ---------------- Render ----------------
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
                  ₹ {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(
                    2
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cartItems.length}</p>
            <h3>Subtotal: ₹ {subtotal}</h3>

            {!showPhoneInput ? (
              <button className="checkout-btn" onClick={handleCheckout}>
                Send Order via WhatsApp
              </button>
            ) : (
              <div className="whatsapp-input-box">
                <input
                  type="text"
                  placeholder="Enter WhatsApp Number (e.g., 918547409237)"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="phone-input"
                />
                <button className="checkout-btn" onClick={confirmSendWhatsApp}>
                  Confirm & Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Authorisation
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        setUserData={setCurrentUser}
      />
    </div>
  );
};

export default AddToCart;
