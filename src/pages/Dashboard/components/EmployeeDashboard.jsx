import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Button, Alert, Descriptions, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, ScheduleOutlined, DollarCircleOutlined, IdcardOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import nhanVienApi from '../../../api/nhanVienApi';
import { useAuth } from '../../../contexts/AuthContext';

const EmployeeDashboard = () => {
  //1.KHAI BÁO HOOKS & STATE 
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  
//2.HÀM LẤY DỮ LIỆU CÁ NHÂN 
  useEffect(() => {
    const fetchMyProfile = async () => {
      setLoading(true);
      try {
        const res = await nhanVienApi.get(user.ma_nhan_vien);
        setMyProfile(res.data.data);
      } catch (error) {
        console.error("Lỗi tải thông tin cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyProfile();
  }, [user]);

//3. XỬ LÝ HIỂN THỊ KHI ĐANG TẢI HOẶC LỖI
  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  if (!myProfile) return null;

//4. GIAO DIỆN CHÍNH 
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, background: '#fff', padding: 24, borderRadius: 8, display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 24 }} />
        <div>
          <h2 style={{ margin: 0 }}>Xin chào, {myProfile.ten_nhan_vien}!</h2>
          <p style={{ color: '#888', margin: '4px 0 0 0' }}>
            Mã NV: <Tag color="blue">{myProfile.ma_nhan_vien}</Tag>
          </p>
        </div>
      </div>

      <Row gutter={24}>
        <Col span={16} xs={24} md={16}>
          <Card title={<span><IdcardOutlined /> Thông Tin Cá Nhân</span>} bordered={false} style={{ height: '100%', marginBottom: 16 }}>
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Phòng Ban"><b>{myProfile.phongBan?.ten_phong || '---'}</b></Descriptions.Item>
              <Descriptions.Item label="Chức Vụ"><b>{myProfile.chucVu?.ten_chuc_vu || '---'}</b></Descriptions.Item>
              <Descriptions.Item label="Ngày Vào Làm">{myProfile.ngay_vao_lam ? dayjs(myProfile.ngay_vao_lam).format('DD/MM/YYYY') : '---'}</Descriptions.Item>
              <Descriptions.Item label="Mức Lương CB"><span style={{ color: '#cf1322', fontWeight: 'bold' }}>{Number(myProfile.muc_luong_co_ban).toLocaleString('vi-VN')} VNĐ</span></Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={8} xs={24} md={8}>
          <Card title="Truy Cập Nhanh" bordered={false} style={{ height: '100%' }}>
            <Button block size="large" icon={<DollarCircleOutlined />} style={{ height: 50, borderColor: '#52c41a', color: '#52c41a' }} onClick={() => navigate('/bao-cao')}>Xem Phiếu Lương</Button>
            <Divider orientation="left" style={{ fontSize: 12, color: '#999' }}>Hỗ trợ</Divider>
            <p><PhoneOutlined /> Hotline: 1900 1234</p>
            <p><MailOutlined /> Email: hr@company.com</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDashboard;