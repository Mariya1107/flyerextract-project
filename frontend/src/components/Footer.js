import React from 'react';
import './Footer.css';

const Footer = () => {
  const footerSections = [
    { title: "Product", items: ["Features", "Pricing", "Case studies", "Reviews", "Updates"] },
    { title: "Support", items: ["Getting started", "Help center", "Server status", "Report a bug", "Chat support"] },
    { title: "For Provider", items: ["About", "Contact us", "Careers", "Faq’s", "Blog"] },
    { title: "More Support", items: ["Getting started", "Help center", "Other Products", "Report a bug", "Chat support"] },
  ];

  const socialPlatforms = [
    { name: "Facebook", icon: "/assets/facebook.png" },
    { name: "Instagram", icon: "/assets/insta.png" },
    { name: "LinkedIn", icon: "/assets/linkedln.png" },
    { name: "WhatsApp", icon: "/assets/whatsapp.jpg" },
    { name: "YouTube", icon: "/assets/yotube.jpg" },
    { name: "Twitter", icon: "/assets/x.jpg" },
  ];

  return (
    <footer className="footer bg-dark text-light">
      <div className="container">
        <div className="row">
          {/* Link Columns */}
          {/* {footerSections.map((section, i) => (
            <div className="col-12 col-md-3 mb-4" key={`${section.title}-${i}`}>
              <h5 className="mb-3">{section.title}</h5>
              <ul className="list-unstyled">
                {section.items.map((item, j) => (
                  <li key={`${item}-${j}`} className="mb-2">
                    <a href="#home" className="text-light text-decoration-none">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}

          {/* Subscription + App download */}
         
        </div>

        {/* Social Icons */}
        {/* <div className="d-flex justify-content-center gap-3 my-3 flex-wrap">
          
          {socialPlatforms.map(platform => (
            <a href="#home" key={platform.name}>
              <img src={platform.icon} alt={platform.name} width="30" />
            </a>
          ))}
        </div> */}

        {/* Footer Bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center" >
          <p className="mb-2 mb-md-0">Copyright © 2025 - All Rights Reserved Gravity</p>
          <ul className="list-unstyled d-flex gap-3 mb-0 flex-wrap">
            <li><a href="#home" className="text-light text-decoration-none">Terms and Conditions</a></li>
            <li><a href="#home" className="text-light text-decoration-none">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
