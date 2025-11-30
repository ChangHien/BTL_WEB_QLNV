import React from "react";
import { Routes, Route } from "react-router-dom";
import ChamCongPage from "./pages/ChamCong/ChamCongPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChamCongPage />} />
      {/* thêm các route khác ở đây */}
    </Routes>
  );
}

export default App;
