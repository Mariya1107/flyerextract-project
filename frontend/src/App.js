import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import FlyerDetail from "./pages/FlyerDetail";
import CropUploader from "./components/CropUploader";
import FlyerList from "./pages/FlyerList";
import BrochureViewer from "./pages/BrochureViewer";
import ProviderLogin from "./components/ProviderLogin";

// Dashboard pages
import ProviderLoginDashboard from './pages/ProviderLoginDashboard';
import UploadBrochure from "./pages/UploadBrochure";
import EditBrochure from "./pages/EditBrochure";
import ExtractProducts from "./pages/ExtractProducts";
import ProvidersPageDash from './pages/ProvidersPageDash';

// Shared layout wrapper for dashboard
import DashboardLayoutWrapper from "./components/DashboardLayoutWrapper";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
          <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
          <Route path="/brochure/:id" element={<BrochureViewer />} />
          <Route path="/flyers" element={<FlyerList />} />
          <Route path="/store/:id/flyers" element={<FlyerList />} />
          <Route path="/provider-login" element={<ProviderLogin />} />
        </Route>

        {/* Provider Dashboard + Sub Pages - consistent layout */}
        <Route path="/provider-dashboard" element={<DashboardLayoutWrapper />}>
          <Route index element={<ProviderLoginDashboard />} />
          <Route path="upload-brochure" element={<UploadBrochure />} />
          <Route path="edit-brochure" element={<EditBrochure />} />
          <Route path="extract-products" element={<ExtractProducts />} />
          <Route path="providers" element={<ProvidersPageDash />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
