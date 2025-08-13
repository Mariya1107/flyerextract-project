import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BecomeShop.css";
import ProviderModal1 from "../components/ProviderModal1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const BecomeShop = () => {
  const navigate = useNavigate();
  const [showProviderModal1, setShowProviderModal1] = useState(false);

  return (
    <div className="become-shop-container">
      {/* Heading */}
      <header className="become-shop-header">
        <h1>Become a Shop Partner</h1>
        <p>
          Grow your business by sharing your offers and flyers with thousands
          of customers.
        </p>
      </header>

      {/* About Us */}
      <section className="become-shop-section">
        <h2>About Us</h2>
        <p>
          We are an all-in-one platform where customers can discover, browse,
          and shop from local stores. From supermarket flyers to exclusive
          offers, we bring everything into one easy-to-use place. Our goal is
          to connect businesses with the right audience and make shopping
          smarter for everyone.
        </p>
      </section>

      {/* Why Join */}
      <section className="become-shop-section">
        <h2>Why Join Us?</h2>
        <ul>
          <li>📢 Upload and share your flyers with thousands of customers.</li>
          <li>🛒 Showcase your offers and products in real-time.</li>
          <li>📈 Expand your reach and attract new customers.</li>
          <li>💳 Enable buyers to purchase directly from your offers.</li>
          <li>💼 Manage everything in one simple dashboard.</li>
        </ul>
      </section>

      {/* How It Works */}
      <section className="become-shop-section">
        <h2>How It Works</h2>
        <ol>
          <li>Create your provider account.</li>
          <li>Upload your store flyers and offers.</li>
          <li>Reach thousands of potential customers instantly.</li>
          <li>Manage orders and promotions from your dashboard.</li>
        </ol>
      </section>

      {/* CTA */}
      <div className="become-shop-cta">
        <a
          href="#"
          className="btn btn-linear-primary"
          onClick={(e) => {
            e.preventDefault();
            setShowProviderModal1(true);
          }}
        >
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Become a Shop With Us
        </a>
      </div>

      {/* Modal */}
      {showProviderModal1 && (
        <ProviderModal1
          showModal={showProviderModal1}
          setShowModal={setShowProviderModal1}
        />
      )}
    </div>
  );
};

export default BecomeShop;
