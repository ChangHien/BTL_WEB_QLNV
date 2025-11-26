import React from 'react';
import { Layout, Button, Dropdown, Space, Avatar, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header } = Layout;

const AppHeader = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { token: { colorBgContainer } } = theme.useToken();

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
    <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{ fontSize: '16px', width: 64, height: 64 }}
      />

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
  );
};

export default AppHeader;