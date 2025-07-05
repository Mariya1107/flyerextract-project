import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FlyerDetail from "./pages/FlyerDetail";
import CropUploader from "./components/CropUploader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flyers/:flyerId" element={<FlyerDetail />} />
        <Route path="/manual-upload/:flyerId" element={<CropUploader />} />
      </Routes>
    </Router>
  );
}

export default App;
