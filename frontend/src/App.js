import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import FlyerDetail from "./pages/FlyerDetail";
import CropUploader from "./components/CropUploader";
import FlyerList from "./pages/FlyerList";
import BrochureViewer from "./pages/ProviderBrochureDash.js";
import ProviderLogin from "./components/ProviderLogin";

// Provider Dashboard pages
import ProviderLoginDashboard from './pages/ProviderLoginDashboard';
import UploadBrochure from "./pages/UploadBrochure";
import EditBrochure from "./pages/EditBrochure";
import ExtractProducts from "./pages/ExtractProducts";
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

// Layout wrappers
import DashboardLayoutWrapper from "./components/DashboardLayoutWrapper";
import DashboardLayoutWrapper2 from "./components/DashboardLayoutWrapper2"; // ✅ NEW


function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
          <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
          <Route path="/brochure/:id" element={<BrochureViewer />} />
          <Route path="/flyers" element={<FlyerList />} />
          <Route path="/store/:id/flyers" element={<FlyerList />} />
          <Route path="/provider-login" element={<ProviderLogin />} />
        </Route>

        {/* 🧑‍💼 Provider Dashboard */}
        <Route path="/provider-dashboard" element={<DashboardLayoutWrapper />}>
          <Route index element={<ProviderLoginDashboard />} />
          <Route path="upload-brochure" element={<UploadBrochure />} />
          <Route path="edit-brochure" element={<EditBrochure />} />
          <Route path="extract-products" element={<ExtractProducts />} />
          <Route path="providers" element={<ProvidersPageDash />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="/provider-dashboard/brochures" element={<ProviderBrochureDash />} />

        </Route>

        {/* 👨‍💼 Admin Dashboard */}
        <Route path="/admin-dashboard" element={<DashboardLayoutWrapper2 />}>
          <Route index element={<AdminLoginDashboard />} />
          <Route path="edit-profile" element={<EditProfileAdmin />} /> {/* ✅ */}
          <Route path="/admin-dashboard/users" element={<UsersAdminDash />} />
          <Route path="providers" element={<ProvidersAdminDash />} />
          <Route path="countries" element={<CountryAdmin />} />
          <Route path="regions" element={<RegionAdmin />} />
          <Route path="provider-applications" element={<ProviderApplicationDash />} />
          

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
