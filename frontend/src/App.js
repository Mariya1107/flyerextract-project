import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FlyerDetail from "./pages/FlyerDetail";
import CropUploader from "./components/CropUploader";
import FlyerList from "./pages/FlyerList";
import BrochureViewer from "./pages/BrochureViewer";
import ProviderLogin from "./components/ProviderLogin"; // ✅ Adjust path if needed
import ProviderLoginDashboard from './pages/ProviderLoginDashboard'; // Adjust path if needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
        <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
        <Route path="/brochure/:id" element={<BrochureViewer />} />
        <Route path="/flyers" element={<FlyerList />} />
         <Route path="/provider-login" element={<ProviderLogin />} />
         <Route path="/provider-dashboard" element={<ProviderLoginDashboard />} />
         
      </Routes>
    </Router>
  );
}

export default App;
