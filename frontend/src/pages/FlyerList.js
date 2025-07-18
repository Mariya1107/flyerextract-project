import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

// --- Helper Components & Configuration ---

// In a real application, this would be in a separate config file.
const BASE_URL = 'https://api.example.com/'; 

// A placeholder component to simulate the PDF preview
const PdfPlaceholder = ({ file }) => (
  <div className="pdf-placeholder">
    <span className="pdf-icon">📄</span>
    <span className="pdf-text">View Brochure</span>
  </div>
);


// --- Main FlyerList Component ---

const FlyerList = () => {
  const { id } = useParams();
  const [flyers, setFlyers] = useState([]);

  // Mock data for demonstration
  const mockFlyers = [
    { id: 1, title: 'Galaxy Electronics: Mega Sale', image: 'https://placehold.co/600x400/7c3aed/ffffff?text=Electronics', pdf: null },
    { id: 2, title: 'FreshMart: Weekly Grocery Deals', image: null, pdf: 'path/to/grocery.pdf' },
    { id: 3, title: 'Urban Fashion: End of Season', image: 'https://placehold.co/600x400/db2777/ffffff?text=Fashion', pdf: null },
    { id: 4, title: 'Home Decor: Renovation Offers', image: null, pdf: 'path/to/decor.pdf' },
    { id: 5, title: 'Adventure Gear: Outdoor Specials', image: 'https://placehold.co/600x400/16a34a/ffffff?text=Adventure', pdf: null },
    { id: 6, title: 'Gourmet Foods: Taste the World', image: null, pdf: 'path/to/gourmet.pdf' },
  ];

  useEffect(() => {
    // Using mock data for the preview environment
    setFlyers(mockFlyers);
    
    // The original API call is commented out
    /*
    axios.get(`${BASE_URL}flyers/${id}/`)
      .then((res) => setFlyers(res.data))
      .catch((err) => {
        console.error("Error fetching flyers:", err);
        setFlyers(mockFlyers);
      });
    */
  }, [id]);

  // --- 3D Tilt Effect Handlers ---
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 8; // Max rotation in degrees
    const rotateY = ((x - width / 2) / (width / 2)) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };


  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .flyer-list-wrapper { 
          padding: 60px 20px; 
          background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e);
          background-size: 400% 400%;
          animation: aurora 15s ease infinite;
          min-height: 100vh; 
        }
        .flyer-title { 
          text-align: center; 
          font-size: 3rem; 
          font-weight: 900; 
          color: #ffffff; 
          margin-bottom: 50px;
          text-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .no-flyers { text-align: center; font-size: 1.2rem; color: #fff; background: rgba(0,0,0,0.2); padding: 50px; border-radius: 16px; }
        .flyer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px; max-width: 1200px; margin: 0 auto; }
        
        .flyer-card { 
          border-radius: 18px; 
          text-decoration: none; 
          color: inherit; 
          opacity: 0; 
          animation: fadeInUp 0.6s ease-out forwards;
          position: relative;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .flyer-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 18px; 
          overflow: hidden; 
          display: flex; 
          flex-direction: column; 
          background: rgba(0,0,0,0.2);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transform: translateZ(0); /* GPU acceleration */
        }
        
        /* Glowing border effect */
        .flyer-card::before {
          content: "";
          position: absolute;
          left: -2px; top: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          border-radius: 20px;
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        
        .flyer-card:hover::before {
          opacity: 1;
        }

        .flyer-img-wrapper { position: relative; height: 200px; background-color: #333; display: flex; align-items: center; justify-content: center; overflow: hidden;}
        .flyer-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .flyer-card:hover .flyer-img { transform: scale(1.1); }
        
        .pdf-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-align: center; height: 100%; background: rgba(0,0,0,0.3); }
        .pdf-icon { font-size: 3.5rem; }
        .pdf-text { margin-top: 10px; font-weight: 600; font-size: 1.1rem; }
        
        .flyer-tag { position: absolute; top: 15px; right: 15px; padding: 6px 12px; color: white; font-weight: 700; font-size: 0.85rem; background: rgba(0,0,0,0.4); border-radius: 20px; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2); }
        
        .flyer-info { 
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255,255,255,0.2);
          padding: 20px; 
          flex-grow: 1; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          transform: translateZ(20px); /* Parallax effect */
        }
        .flyer-heading { font-size: 1.3rem; font-weight: 800; color: #ffffff; margin: 0 0 15px 0; line-height: 1.4; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        
        .flyer-view-btn { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-radius: 10px; font-weight: 700; color: #fff; background: linear-gradient(45deg, #3b82f6, #6366f1); transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .flyer-view-btn span:last-child { transition: transform 0.3s ease; }
        .flyer-card:hover .flyer-view-btn { background-position: right center; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5); }
        .flyer-card:hover .flyer-view-btn span:last-child { transform: translateX(5px); }
      `}</style>

      <div className="flyer-list-wrapper">
        <h2 className="flyer-title">✨ Unlock Today's Hottest Deals ✨</h2>

        {flyers.length === 0 ? (
          <p className="no-flyers">🚫 No flyers available right now. Check back soon!</p>
        ) : (
          <div className="flyer-grid">
            {flyers.map((flyer, index) => (
              <Link
                to={`/flyers/${flyer.id}`}
                key={flyer.id}
                className="flyer-card"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flyer-card-inner">
                  <div className="flyer-img-wrapper">
                    {flyer.image ? (
                      <img src={flyer.image} alt={flyer.title} className="flyer-img" />
                    ) : (
                      <PdfPlaceholder file={flyer.pdf} />
                    )}
                    <div className="flyer-tag">DEAL</div>
                  </div>
                  <div className="flyer-info">
                    <h3 className="flyer-heading">{flyer.title}</h3>
                    <div className="flyer-view-btn">
                      <span>Explore Offer</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FlyerList;
