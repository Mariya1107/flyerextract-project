import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
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
        <Route path="/" element={<Home />} />
        <Route path="/flyers/:flyerId" element={<FlyerDetail />} /> {/* Keep this only */}
        <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
        <Route path="/brochure/:id" element={<BrochureViewer />} />
        <Route path="/flyers" element={<FlyerList />} /> {/* General list */}
        <Route path="/store/:id/flyers" element={<FlyerList />} /> {/* Store-specific list */}
        <Route path="/provider-login" element={<ProviderLogin />} />
        <Route path="/provider-dashboard" element={<ProviderLoginDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
