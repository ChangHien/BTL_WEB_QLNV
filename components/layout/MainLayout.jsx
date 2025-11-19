import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined, 
  SolutionOutlined, 
  UserOutlined, 
  DashboardOutlined, 
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/', 
    icon: <DashboardOutlined />,
    label: 'Trang chủ',
  },
  {
    key: '/phong-ban',
    icon: <BankOutlined />,
    label: 'Quản lý Phòng Ban',
  },
  {
    key: '/chuc-vu',
    icon: <UserOutlined />,
    label: 'Quản lý Chức Vụ',
  },
  {
    key: '/nhan-vien',
    icon: <SolutionOutlined />,
    label: 'Quản lý Nhân Viên',
  },
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false); 
  const navigate = useNavigate(); 

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar (Menu bên trái) */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255,255,255,.2)', borderRadius: '6px' }} />
        
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']} 
          items={menuItems}
          onClick={handleMenuClick} 
        />
      </Sider>

      {/*  Phần layout chính (Header + Content) */}
      <Layout>
        {/* Header (thanh ngang bên trên) */}
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        
        {/* Content (Vùng nội dung chính) */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Đây là nơi các trang con (PhongBan, NhanVien...) sẽ được render */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;