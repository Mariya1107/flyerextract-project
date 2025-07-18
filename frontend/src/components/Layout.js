import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

import ProviderLogin from './ProviderLogin';
import AdminLogin from './AdminLogin';
import ProviderModal1 from './ProviderModal1';
import Authorisation from './Authorisation';

const Layout = () => {
  const location = useLocation();
  const hideLayoutRoutes = [

  '/provider-dashboard',
  
];

const hideLayout = hideLayoutRoutes.includes(location.pathname);


  // 🔐 Centralized modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showProviderModal1, setShowProviderModal1] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [userData, setUserData] = useState(null);

  return (
    <>
      {!hideLayout && (
        <Header
          setShowProviderModal={setShowProviderModal}
          setShowProviderModal1={setShowProviderModal1}
          setShowAdminModal={setShowAdminModal}
          setAuthMode={setAuthMode}
          setShowAuthModal={setShowAuthModal}
        />
      )}

      <main>
        <Outlet />
      </main>

      {/* 🔐 Global Modals */}
      <Authorisation
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        setUserData={setUserData}
      />

      {showProviderModal && (
        <div className="modal-overlay">
          <ProviderLogin setShowProviderModal={setShowProviderModal} />
        </div>
      )}

      {showProviderModal1 && (
        <ProviderModal1
          showModal={showProviderModal1}
          setShowModal={setShowProviderModal1}
        />
      )}

      {showAdminModal && (
        <AdminLogin setShowAdminModal={setShowAdminModal} />
      )}

      {!hideLayout && <Footer />}
    </>
  );
};

export default Layout;
