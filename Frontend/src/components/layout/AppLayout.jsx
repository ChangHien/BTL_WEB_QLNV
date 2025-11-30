import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import "./AppLayout.scss";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <AppHeader />

      <div className="layout-body">
        <AppSidebar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
