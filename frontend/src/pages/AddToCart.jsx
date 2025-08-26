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

  // ---------------- Define CART_SLUG ----------------
  let CART_SLUG = localStorage.getItem("cartSlug");
  if (!CART_SLUG) {
    CART_SLUG = `cart-${Date.now()}`;
    localStorage.setItem("cartSlug", CART_SLUG);
  }

  // ---------------- Load cart from localStorage ----------------
  useEffect(() => {
    const cartSent = localStorage.getItem("cartSent");
    if (cartSent === "true") {
      setCartItems([]); // permanently clear frontend cart
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // ---------------- Only fetch from backend if cart not sent ----------------
  useEffect(() => {
    const cartSent = localStorage.getItem("cartSent");
    if (cartSent === "true") return;

    const fetchCartFromDB = async () => {
      if (!currentUser || !token) return;

      try {
        const res = await fetch(`${BASE_URL}/api/accounts/cart/${CART_SLUG}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const mappedItems = data.items.map((item) => ({
            slug: item.slug,
            id: item.product?.id,
            name: item.product?.name || "Unnamed Product",
            price: item.product?.price || 0,
            quantity: item.quantity,
            total_price:
              item.total_price || item.quantity * (item.product?.price || 0),
            store_name: item.product?.store_name || "Unknown",
            store_slug: item.product?.store_slug || "unknown",
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
    const cartSent = localStorage.getItem("cartSent");

    // If cart was already sent, reset everything for new cart
    if (cartSent === "true") {
      setCartItems([]);
      localStorage.removeItem("cart");
      localStorage.removeItem("cartSent");
      const NEW_CART_SLUG = `cart-${Date.now()}`;
      localStorage.setItem("cartSlug", NEW_CART_SLUG);
      CART_SLUG = NEW_CART_SLUG; // update local CART_SLUG variable
    }

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
        syncCartItemToDB(prod, 1);
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
  const syncCartItemToDB = async (product, qty) => {
    try {
      await fetch(`${BASE_URL}/api/accounts/cart/${CART_SLUG}/add/`, {
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
    for (const item of cartItems) {
      await syncCartItemToDB(item, item.quantity);
    }
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
  const WHATSAPP_NUMBER = "918547409237";
  const buildWhatsAppLink = () => {
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

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // ---------------- Checkout ----------------
  const handleCheckout = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      setAuthMode("signin");
      return;
    }

    // Sync to backend
    await syncLocalCartToDB();

    // Clear frontend cart permanently
    setCartItems([]);
    localStorage.removeItem("cart");
    localStorage.setItem("cartSent", "true"); // prevents reload

    // ---------------- Create new cart on backend ----------------
    try {
      const newCartRes = await fetch(`${BASE_URL}/api/accounts/cart/new/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          cart_slug: `cart-${Date.now()}`, // optional, backend can generate if not sent
        }),
      });

      if (newCartRes.ok) {
        const data = await newCartRes.json();
        localStorage.setItem("cartSlug", data.slug); // update frontend cart slug
      } else {
        console.error("Failed to create new cart on backend", newCartRes.status);
        // fallback: generate local cart slug
        const NEW_CART_SLUG = `cart-${Date.now()}`;
        localStorage.setItem("cartSlug", NEW_CART_SLUG);
      }
    } catch (err) {
      console.error("Error creating new cart", err);
      const NEW_CART_SLUG = `cart-${Date.now()}`;
      localStorage.setItem("cartSlug", NEW_CART_SLUG);
    }

    // Open WhatsApp
    window.open(buildWhatsAppLink(), "_blank");
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
            <button className="checkout-btn" onClick={handleCheckout}>
              Send Order via WhatsApp
            </button>
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
