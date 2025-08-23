import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartLine, faShoppingCart, faBullhorn, faCogs } from "@fortawesome/free-solid-svg-icons";
import ProviderModal1 from "../components/ProviderModal1";
import "./BecomeShop.css";



const BecomeShop = () => {
  const [showProviderModal1, setShowProviderModal1] = useState(false);

  return (
    <div className="">
      {/* Hero Section */}
      <section className="hero-section text-center text-white py-5"  style={{
    backgroundImage: `url("/about.png")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  
  }} >
        <div className="container py-5">
          <h1 className="mb-3">Become a Shop Partner</h1>
          <p className="lead mb-4">
            Grow your business by sharing your offers and flyers with thousands of customers.
          </p>
          <button style={{background: "#000 !important",border: "1px solid #000 !important"}}
            className="for_btn btn btn-lg"
            onClick={() => setShowProviderModal1(true)}
          >
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Join Now
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5" style={{background:"#fff"}}>
        <div className="container">
          <h2 className="text-center mb-4">About Us</h2>
          <p className="text-center text-muted">
            We are an all-in-one platform where customers can discover, browse,
            and shop from local stores. From supermarket flyers to exclusive offers, 
            we bring everything into one easy-to-use place. Our goal is to connect businesses 
            with the right audience and make shopping smarter for everyone.
          </p>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="why-join-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Why Join Us?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card p-4 text-center h-100 shadow-sm">
                <FontAwesomeIcon icon={faBullhorn} size="2x" className="mb-3 " style={{color:"#000"}} />
                <h5>Promote Your Offers</h5>
                <p>Upload and share your flyers with thousands of customers.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center h-100 shadow-sm">
                <FontAwesomeIcon icon={faShoppingCart} size="2x" className="mb-3 " style={{color:"#000"}} />
                <h5>Showcase Products</h5>
                <p>Display your offers and products in real-time to attract buyers.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center h-100 shadow-sm">
                <FontAwesomeIcon icon={faChartLine} size="2x" className="mb-3 " style={{color:"#000"}} />
                <h5>Grow Your Business</h5>
                <p>Expand your reach and manage everything from a single dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section py-5" style={{background:"#f7f7f7"}}>
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="step-card p-3 h-100 shadow-sm">
                <FontAwesomeIcon icon={faUser} size="2x" className="mb-2" style={{color:"#000"}}/>
                <h6>Create Account</h6>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-card p-3 h-100 shadow-sm">
                <FontAwesomeIcon icon={faCogs} size="2x" className="mb-2 " style={{color:"#000"}}/>
                <h6>Upload Flyers</h6>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-card p-3 h-100 shadow-sm">
                <FontAwesomeIcon icon={faBullhorn} size="2x" className="mb-2 " style={{color:"#000"}}/>
                <h6>Reach Customers</h6>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-card p-3 h-100 shadow-sm">
                <FontAwesomeIcon icon={faChartLine} size="2x" className="mb-2" style={{color:"#000"}} />
                <h6>Manage Dashboard</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section text-center py-5 text-white" style={{background:"#7d0d83"}}>
        <h3 className="mb-4">Ready to Grow Your Business?</h3>
        <button
          className="btn btn-light btn-lg"
          onClick={() => setShowProviderModal1(true)}
        >
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Become a Shop With Us
        </button>
      </section>

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
