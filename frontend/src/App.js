import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FlyerDetail from "./pages/FlyerDetail";
import CropUploader from "./components/CropUploader";
import FlyerList from "./pages/FlyerList";
import BrochureViewer from "./pages/BrochureViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
        <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
        <Route path="/brochure/:id" element={<BrochureViewer />} />
        <Route path="/flyers" element={<FlyerList />} />
      </Routes>
    </Router>
    
  );
}




export default App;
