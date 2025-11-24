import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Dropdown, Space, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined,
  SolutionOutlined,
  UserOutlined,
  DashboardOutlined,
  DollarOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import Context để lấy user & logout

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Để biết đang ở trang nào mà highlight menu
  const { user, logout } = useAuth(); // Lấy thông tin user và hàm logout
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // --- 1. HÀM TẠO MENU ĐỘNG DỰA TRÊN QUYỀN ---
  const getMenuItems = () => {
    const role = user?.role; // 'admin', 'hr', hoặc 'nhanvien'

    // Menu Chung (Ai cũng thấy)
    const items = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Trang chủ',
      },
    ];

    // Menu dành cho Quản lý (Admin & HR)
    if (role === 'admin' || role === 'hr') {
      items.push(
        {
          type: 'divider', 
        },
        {
          key: 'quan-ly-to-chuc',
          label: 'Quản Lý Tổ Chức',
          type: 'group',
          children: [
            { key: '/phong-ban', icon: <BankOutlined />, label: 'Phòng Ban' },
            { key: '/chuc-vu', icon: <UserOutlined />, label: 'Chức Vụ' },
            { key: '/nhan-vien', icon: <SolutionOutlined />, label: 'Nhân Viên' },
          ]
        },
        {
          key: 'quan-ly-luong',
          label: 'Quản Lý Lương',
          type: 'group',
          children: [
            { key: '/tinh-luong', icon: <DollarOutlined />, label: 'Tính Lương (HR)' },
          ]
        }
      );
    }

    // Menu dành cho Nhân viên (Và cả Admin cũng có thể xem của chính mình)
    items.push(
      {
        type: 'divider',
      },
      {
        key: 'ca-nhan',
        label: 'Cá Nhân',
        type: 'group',
        children: [
          { key: '/cham-cong', icon: <ScheduleOutlined />, label: 'Chấm công' },
          { key: '/bao-cao', icon: <BarChartOutlined />, label: 'Thu nhập cá nhân' }, // Trang Báo cáo
        ]
      }
    );

    return items;
  };

  // --- 2. MENU DROP DOWN CHO USER (Góc phải trên cùng) ---
  const userMenu = {
    items: [
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: () => {
            logout();
            navigate('/login');
        }
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div className="logo" style={{ 
            height: '32px', margin: '16px', 
            background: 'rgba(255,255,255,.2)', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 'bold', letterSpacing: '1px'
        }}>
            {collapsed ? 'QLNV' : 'HR SYSTEM'}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // Highlight menu đang chọn
          items={getMenuItems()}
          onClick={(e) => navigate(e.key)}
        />
      </Sider>

      {/* MAIN CONTENT */}
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          {/* Thông tin User & Đăng xuất */}
          <Dropdown menu={userMenu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <span style={{ fontWeight: 500 }}>
                    {user?.username} 
                    <span style={{ opacity: 0.6, fontWeight: 'normal', marginLeft: 5 }}>
                        ({user?.role?.toUpperCase()})
                    </span>
                </span>
                <DownOutlined style={{ fontSize: '10px' }} />
              </Space>
            </a>
          </Dropdown>
        </Header>
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto' // Thêm thanh cuộn nếu nội dung quá dài
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;