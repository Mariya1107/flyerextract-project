import React from 'react';
import './Footer.css';

const Footer = () => {
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
      <div className="footer-top container">
        <div className="footer-columns">
          {footerSections.map((section, i) => (
            <div className="footer-col" key={section.title + i}>
              <h5>{section.title}</h5>
              <ul>
                {section.items.map((item, j) => (
                  <li key={`${section.title}-${j}`}>
                    <a href="#home">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col subscribe">
            <h5>SignUp For Subscription</h5>
            <input type="email" placeholder="Enter Email Address" />
            <button type="submit">Subscribe</button>

            <div className="download-label">Download Our App</div>
            <div className="app-icons">
              <img src="/assets/img/icons/app-store.svg" alt="App Store" />
              <img src="/assets/img/icons/goolge-play.svg" alt="Google Play" />
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

          <div className="dropdowns">
            <div className="dropdown">
              <span>
                <img src="/assets/img/flags/us.png" className="flag" alt="flag" />
                English
              </span>
              <ul>
                {languages.map(({ name, flag }) => (
                  <li key={flag}>
                    <a href="#home">
                      <img src={`/assets/img/flags/${flag}.png`} className="flag" alt={flag} />
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dropdown">
              <span>USD</span>
              <ul>
                {currencies.map((currency) => (
                  <li key={currency}>
                    <a href="#home">{currency}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 - All Rights Reserved Gravity</p>
          <ul className="bottom-links">
            <li><a href="#home">Terms and Conditions</a></li>
            <li><a href="#home">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;