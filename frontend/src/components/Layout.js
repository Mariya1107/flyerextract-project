// src/components/Layout.js

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

import ProviderLogin from './ProviderLogin';
import AdminLogin from './AdminLogin';
import ProviderModal1 from './ProviderModal1';
import Authorisation from './Authorisation';

const Layout = ({ showAdminModal: initialShowAdminModal = false, setShowAdminModal: setParentShowAdminModal }) => {
  const location = useLocation();

  // Hide layout for ALL dashboard routes
  const hideLayout = location.pathname.startsWith('/provider-dashboard') 
                  || location.pathname.startsWith('/admin-dashboard');

  // Centralized modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showProviderModal1, setShowProviderModal1] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(initialShowAdminModal);

  // Sync with parent prop (for hidden /admin-login URL)
  useEffect(() => {
    if (setParentShowAdminModal) {
      setShowAdminModal(initialShowAdminModal);
    }
  }, [initialShowAdminModal, setParentShowAdminModal]);

  return (
    <div
      className="app-layout"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Full viewport height
      }}
    >
      {!hideLayout && (
        <Header
          setShowProviderModal={setShowProviderModal}
          setShowProviderModal1={setShowProviderModal1}
          setShowAdminModal={setShowAdminModal} 
          setAuthMode={setAuthMode}
          setShowAuthModal={setShowAuthModal}
        />
      )}

      {/* Main content grows to push footer down */}
      <main
        className="app-content"
        style={{
          flex: 1, // Takes remaining space
        }}
      >
        <Outlet />
      </main>

      {/* Global Modals */}
      <Authorisation
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        setUserData={() => {}}
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

      {showAdminModal && <AdminLogin setShowAdminModal={setShowAdminModal} />}

      {!hideLayout && (
        <div style={{ marginTop: 'auto' }}>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
