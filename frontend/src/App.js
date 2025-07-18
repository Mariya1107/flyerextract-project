import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import FlyerDetail from "./pages/FlyerDetail";
import CropUploader from "./components/CropUploader";
import FlyerList from "./pages/FlyerList";
import BrochureViewer from "./pages/BrochureViewer";
import ProviderLogin from "./components/ProviderLogin";
import ProviderLoginDashboard from './pages/ProviderLoginDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
          <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
          <Route path="/brochure/:id" element={<BrochureViewer />} />
          <Route path="/flyers" element={<FlyerList />} />
          <Route path="/store/:id/flyers" element={<FlyerList />} />
          <Route path="/provider-login" element={<ProviderLogin />} />
          <Route path="/provider-dashboard" element={<ProviderLoginDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
