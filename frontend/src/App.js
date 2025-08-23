import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import FlyerDetail from "./pages/FlyerDetail";
import BecomeShop from "./pages/BecomeShop";
import FlyerList from "./pages/FlyerList";
import BrochureViewer from "./pages/ProviderBrochureDash.js";
import ProviderLogin from "./components/ProviderLogin";
import 'bootstrap/dist/css/bootstrap.min.css';

// Provider Dashboard pages
import ProviderLoginDashboard from './pages/ProviderLoginDashboard';
import UploadBrochure from "./pages/UploadBrochure";
import EditBrochure from "./pages/EditBrochure";
import ProvidersPageDash from './pages/ProvidersPageDash';
import EditProfile from "./pages/EditProfile";
import ProviderBrochureDash from "./pages/ProviderBrochureDash";

// Admin Dashboard
import AdminLoginDashboard from './pages/AdminLoginDashboard';
import EditProfileAdmin from './pages/EditProfileAdmin';
import UsersAdminDash from './pages/UsersAdminDash';
import ProvidersAdminDash from './pages/ProvidersAdminDash';
import CountryAdmin from "./components/CountryAdmin"; 
import RegionAdmin from './components/RegionAdmin';
import ProviderApplicationDash from "./pages/ProviderApplicationDash";
import AdminBrochure from "./pages/AdminBrochure";
import AdminBrochureExtract from "./pages/AdminBrochureExtract";
import AdminStoreBrochure from "./pages/AdminStoreBrochure";
import AdminStoreBrochureExtract from "./pages/AdminStoreBrochureExtract";
import ApprovalAdmin from './pages/ApprovalAdmin';
import CropProducts from './pages/CropProducts'; 

// Layout wrappers
import DashboardLayoutWrapper from "./components/DashboardLayoutWrapper";
import DashboardLayoutWrapper2 from "./components/DashboardLayoutWrapper2";

// 🛒 Cart Page
import AddToCart from "./pages/AddToCart";

function App() {
  const [userData, setUserData] = useState(null);

  // Load user session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>

        {/* 🌐 Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Flyers by Region */}
          <Route path="flyers/:region_slug" element={<FlyerList />} />

          {/* Flyers by Store */}
          <Route path="store/:store_slug/flyers" element={<FlyerList />} />

          {/* Flyer Details */}
          <Route path="flyers/:flyer_slug/detail" element={<FlyerDetail />} />

          {/* Other Public Pages */}
          <Route path="brochure/:id" element={<BrochureViewer />} />
          <Route path="provider-login" element={<ProviderLogin />} />
          <Route path="becomeshop" element={<BecomeShop />} />

          {/* 🛒 Cart now receives userData */}
          <Route path="cart" element={<AddToCart userData={userData} />} />
        </Route>

        {/* 🧑‍💼 Provider Dashboard */}
        <Route path="/provider-dashboard" element={<DashboardLayoutWrapper />}>
          <Route index element={<ProviderLoginDashboard />} />
          <Route path="upload-brochure" element={<UploadBrochure />} />
          <Route path="edit-brochure" element={<EditBrochure />} />
          <Route path="providers" element={<ProvidersPageDash />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="brochures" element={<ProviderBrochureDash />} />
        </Route>

        {/* 👨‍💼 Admin Dashboard */}
        <Route path="/admin-dashboard" element={<DashboardLayoutWrapper2 />}>
          <Route index element={<AdminLoginDashboard />} />
          <Route path="edit-profile" element={<EditProfileAdmin />} />
          <Route path="users" element={<UsersAdminDash />} />
          <Route path="providers" element={<ProvidersAdminDash />} />
          <Route path="countries" element={<CountryAdmin />} />
          <Route path="regions" element={<RegionAdmin />} />
          <Route path="provider-applications" element={<ProviderApplicationDash />} />
          <Route path="store/:store_slug/brochures" element={<AdminStoreBrochure />} />
          <Route path="store-brochures" element={<AdminBrochure />} />
          <Route path="approvals" element={<ApprovalAdmin />} />
          <Route path="crop-products/:flyer_slug" element={<CropProducts />} />
          <Route path="storebrochure-extracts" element={<AdminBrochureExtract />} />
          <Route path="store/:store_slug/brochure-extract" element={<AdminStoreBrochureExtract />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
