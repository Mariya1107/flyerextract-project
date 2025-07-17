import React from 'react';
import './Footer.css';

const Footer = () => {
  // Updated to match the four link columns in the image
  const footerSections = [
    {
      title: "Product",
      items: ["Features", "Pricing", "Case studies", "Reviews", "Updates"],
    },
    {
      title: "Support",
      items: ["Getting started", "Help center", "Server status", "Report a bug", "Chat support"],
    },
    {
      title: "For Provider",
      items: ["About", "Contact us", "Careers", "Faq’s", "Blog"],
    },
    { // Added the fourth column from the image
      title: "Support",
      items: ["Getting started", "Help center", "Other Products", "Report a bug", "Chat support"],
    },
  ];

  const languages = [
    { name: "English", flag: "us" },
    { name: "Japanese", flag: "jp" },
    { name: "Chinese", flag: "cn" },
  ];

  const currencies = ["USD", "EURO", "YEN"];

  const socialPlatforms = ["fb", "instagram", "twitter", "whatsapp", "youtube", "linkedin"];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* A new wrapper for the link columns */}
          <div className="footer-links-group">
            {footerSections.map((section, i) => (
              <div className="footer-col" key={`${section.title}-${i}`}>
                <h5>{section.title}</h5>
                <ul>
                  {section.items.map((item, j) => (
                    <li key={`${item}-${j}`}>
                      <a href="#home">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Renamed to a more specific class for card styling */}
          <div className="subscribe-card">
            <h5>SignUp For Subscription</h5>
            <div className="subscribe-input-group">
              <input type="email" placeholder="Enter Email Address" />
              <button type="submit">Subscribe</button>
            </div>

            <h6 className="download-title">Download Our App</h6>
            <div className="app-icons">
              {/* Note: The image shows specific branded badges. You'll need to source these image assets. */}
              <a href="#appstore"><img src="/assets/img/icons/app-store.svg" alt="App Store" /></a>
              <a href="#playstore"><img src="/assets/img/icons/goolge-play.svg" alt="Google Play" /></a>
            </div>
          </div>
        </div>

<div className="footer-meta">
  <ul className="social-icons">
    {socialPlatforms.map((platform) => (
      <li key={platform}>
        <a href="#home">
          <img src={`/assets/img/icons/${platform}.svg`} alt={platform} />
        </a>
      </li>
    ))}
  </ul>
</div>


        <div className="footer-bottom">
          {/* Updated copyright text and year */}
          <p>Copyright © 2024 - All Rights Reserved Gravity</p>
          <ul className="bottom-links">
            <li><a href="#home">Terms and Conditions </a></li>l
            <li><a href="#home">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;