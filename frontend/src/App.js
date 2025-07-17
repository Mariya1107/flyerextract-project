import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FlyerDetail from "./pages/FlyerDetail";
import CropUploader from "./components/CropUploader";
import FlyerList from "./pages/FlyerList";
import BrochureViewer from "./pages/BrochureViewer";
import ProviderLogin from "./components/ProviderLogin"; // ✅ Adjust path if needed
import StoreFlyerList from './pages/StoreFlyerList';

import FlyersByStore from './pages/FlyersByStore';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store/:storeName" element={<FlyersByStore />} />
        <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
        <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
        <Route path="/flyer/:id" element={<FlyerDetail />} />
        <Route path="/brochure/:id" element={<BrochureViewer />} />
        <Route path="/flyers" element={<FlyerList />} />
        <Route path="/store/:storeId/flyers" element={<StoreFlyerList />} />

        <Route path="/provider-login" element={<ProviderLogin />} />
      </Routes>
    </Router>

  );
}

export default App;
