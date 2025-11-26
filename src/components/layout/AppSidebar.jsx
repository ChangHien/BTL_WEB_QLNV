import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined, BankOutlined, UserOutlined, SolutionOutlined,
  DollarOutlined, BarChartOutlined, SafetyCertificateOutlined,
  SettingOutlined, UsergroupAddOutlined, CalendarOutlined, GiftOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Sider } = Layout;

const AppSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getMenuItems = () => {
    const role = user?.role;

    // 1. MENU CHUNG 
    const items = [
      { key: '/', icon: <DashboardOutlined />, label: 'Trang chủ' },
    ];

    // 2. MENU NGHIỆP VỤ (Dành cho Admin & HR)
    if (role === 'admin' || role === 'hr') {
      items.push(
        { type: 'divider' },
        {
          key: 'quan-ly-to-chuc',
          label: 'QUẢN LÝ TỔ CHỨC',
          type: 'group',
          children: [
            { key: '/phong-ban', icon: <BankOutlined />, label: 'Phòng Ban' },
            { key: '/chuc-vu', icon: <UserOutlined />, label: 'Chức Vụ' },
            { key: '/nhan-vien', icon: <SolutionOutlined />, label: 'Nhân Viên' },
          ]
        },
        {
          key: 'nghiep-vu-khac',
          label: 'NGHIỆP VỤ KHÁC',
          type: 'group',
          children: [
            { key: '/nghi-phep', icon: <CalendarOutlined />, label: 'Quản lý Nghỉ phép' },
            { key: '/thuong-phat', icon: <GiftOutlined />, label: 'Khen thưởng & Kỷ luật' },
          ]
        },
        {
          key: 'quan-ly-luong',
          label: 'QUẢN LÝ LƯƠNG',
          type: 'group',
          children: [
            { key: '/tinh-luong', icon: <DollarOutlined />, label: 'Tính Lương (Payroll)' },
            { key: '/bao-cao', icon: <BarChartOutlined />, label: 'Tra Cứu Thu Nhập' },
          ]
        }
      );
    }

    // 3. MENU QUẢN TRỊ HỆ THỐNG (DÀNH RIÊNG CHO ADMIN)
    if (role === 'admin') {
      items.push(
        { type: 'divider' },
        {
          key: 'he-thong',
          label: 'HỆ THỐNG (ADMIN)',
          type: 'group',
          children: [
            { key: '/tai-khoan', icon: <UsergroupAddOutlined />, label: 'Quản Lý Tài Khoản' },
            { key: '/cai-dat', icon: <SettingOutlined />, label: 'Cấu Hình Chung' },
            { key: '/nhat-ky', icon: <SafetyCertificateOutlined />, label: 'Nhật Ký Hoạt Động' }
          ]
        }
      );
    }

    // 4. MENU NHÂN VIÊN
    if (role === 'nhanvien') {
      items.push(
        { type: 'divider' },
        {
          key: 'tien-ich-ca-nhan', label: 'TIỆN ÍCH CÁ NHÂN', type: 'group',
          children: [
            { key: '/bao-cao', icon: <DollarOutlined />, label: 'Phiếu Lương Của Tôi' },
          ]
        }
      );
    }

    return items;
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={260} theme="dark">
      <div className="logo" style={{
        height: '32px', margin: '16px',
        lineHeight: '32px', borderRadius: '6px'
      }}>
        {collapsed ?'MS' : 'MANAGEMENT SYSTEM'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={getMenuItems()}
        onClick={(e) => navigate(e.key)}
      />
    </Sider>
  );
};

export default AppSidebar;