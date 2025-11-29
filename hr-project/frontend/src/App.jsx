import React from "react";
import NhanVienPage from "./pages/NhanVien/NhanVienPage";
import ChamCongPage from "./pages/ChamCong/ChamCongPage";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>HR - Dev2</h1>
      <div style={{ marginBottom: 20 }}>
        <a href="#nv">Nhân viên</a> | <a href="#cc">Chấm công</a>
      </div>
      <section id="nv"><NhanVienPage /></section>
      <hr />
      <section id="cc"><ChamCongPage /></section>
    </div>
  );
}
