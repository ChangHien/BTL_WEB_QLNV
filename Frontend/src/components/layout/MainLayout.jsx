import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import BackgroundImage from '../../assets/image/bg.jpg';
import AppHeader from './AppHeader';
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      {/* Sidebar:  */}
      <AppSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Content bên phải */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

        {/* Header:  */}
        <AppHeader />

        {/* Nội dung chính */}
        <main className="flex-1 overflow-auto h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;