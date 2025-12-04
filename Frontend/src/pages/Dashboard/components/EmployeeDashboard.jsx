import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Button, Descriptions, Avatar, Tag, Divider, Statistic } from 'antd';
import { 
    UserOutlined, DollarCircleOutlined, IdcardOutlined, PhoneOutlined, 
    MailOutlined, CheckCircleOutlined, WarningOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import nhanVienApi from '../../../api/nhanVienApi';
import chamCongApi from '../../../api/chamCongApi';
import { useAuth } from '../../../contexts/AuthContext';

// Map trạng thái từ Backend trả về
const STATUS_MAP = {
    DUNG_GIO: 'DungGio',
    DI_MUON: 'DiMuon',
    VE_SOM: 'VeSom'
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  
  // State dữ liệu biểu đồ
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ 
      totalDays: 0, 
      lateDays: 0, 
      onTimeDays: 0, 
      earlyDays: 0 
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin cá nhân
        const resProfile = await nhanVienApi.get(user.ma_nhan_vien);
        setMyProfile(resProfile.data.data);

        // 2. Lấy dữ liệu chấm công tháng hiện tại
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();
        const resCC = await chamCongApi.getLichSu(user.ma_nhan_vien, currentMonth, currentYear);
        const listCC = resCC.data.data || [];

        // 3. Xử lý số liệu
        let late = 0;
        let onTime = 0;
        let early = 0;

        listCC.forEach(cc => {
            switch (cc.trang_thai_ca) {
                case STATUS_MAP.DUNG_GIO:
                    onTime++;
                    break;
                case STATUS_MAP.DI_MUON:
                    late++;
                    break;
                case STATUS_MAP.VE_SOM:
                    early++;
                    break;
                default:
                    break;
            }
        });

        // Cập nhật thống kê số liệu 
        setAttendanceStats({
            totalDays: listCC.length,
            lateDays: late,
            onTimeDays: onTime,
            earlyDays: early
        });

        // 4. Chuẩn bị dữ liệu cho biểu đồ 
        const chartData = [];
        
        if (early > 0) chartData.push({ 
            name: 'Về sớm', 
            value: early, 
            fill: '#ff4d4f' // Đỏ
        });
        if (late > 0) chartData.push({ 
            name: 'Đi muộn', 
            value: late, 
            fill: '#faad14' // Vàng
        });
        if (onTime > 0) chartData.push({ 
            name: 'Đúng giờ', 
            value: onTime, 
            fill: '#52c41a' // Xanh lá
        });

        setAttendanceData(chartData);

      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  if (!myProfile) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      
      {/* HEADER */}
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
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT & BIỂU ĐỒ */}
        <Col span={14} xs={24} md={14}>
          <Card title={<span><IdcardOutlined /> Thông Tin Cá Nhân</span>} bordered={false} style={{ marginBottom: 16 }}>
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Phòng Ban"><b>{myProfile.phongBan?.ten_phong || '---'}</b></Descriptions.Item>
              <Descriptions.Item label="Chức Vụ"><b>{myProfile.chucVu?.ten_chuc_vu || '---'}</b></Descriptions.Item>
              <Descriptions.Item label="Ngày Vào Làm">{myProfile.ngay_vao_lam ? dayjs(myProfile.ngay_vao_lam).format('DD/MM/YYYY') : '---'}</Descriptions.Item>
              <Descriptions.Item label="Mức Lương CB"><span style={{ color: '#cf1322', fontWeight: 'bold' }}>{Number(myProfile.muc_luong_co_ban).toLocaleString('vi-VN')} VNĐ</span></Descriptions.Item>
            </Descriptions>
          </Card>

          {/* KHỐI THỐNG KÊ CHUYÊN CẦN */}
          <Card title={<span><ClockCircleOutlined /> Thống Kê Tháng {dayjs().month() + 1}</span>} bordered={false}>
            <Row align="middle">
                {/* Phần Chú giải (Legend) dạng Text nằm bên trái */}
                <Col span={10}>
                    <Statistic title="Tổng ngày đi làm" value={attendanceStats.totalDays} suffix="ngày" />
                    
                    <div style={{ marginTop: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px dashed #f0f0f0', paddingBottom: 4 }}>
                            <span style={{ color: '#52c41a', fontWeight: 500 }}><CheckCircleOutlined /> Đúng giờ:</span>
                            <b>{attendanceStats.onTimeDays}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px dashed #f0f0f0', paddingBottom: 4 }}>
                            <span style={{ color: '#faad14', fontWeight: 500 }}><WarningOutlined /> Đi muộn:</span>
                            <b>{attendanceStats.lateDays}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#ff4d4f', fontWeight: 500 }}><ClockCircleOutlined /> Về sớm:</span>
                            <b>{attendanceStats.earlyDays}</b>
                        </div>
                    </div>
                </Col>
                
                {/* Phần Biểu đồ nằm bên phải  */}
                <Col span={14} style={{ height: 250 }}>
                    {attendanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" 
                                cy="50%" 
                                innerRadius="30%" 
                                outerRadius="100%" 
                                barSize={20} 
                                data={attendanceData}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: '#f5f5f5' }} 
                                    clockWise
                                    dataKey="value"
                                    cornerRadius={10}
                                />
                                <Tooltip formatter={(value, name) => [`${value} ngày`, name]} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ 
                            height: '100%', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', flexDirection: 'column', color: '#ccc' 
                        }}>
                            <ClockCircleOutlined style={{ fontSize: 40, marginBottom: 10 }} />
                            <span>Chưa có dữ liệu</span>
                        </div>
                    )}
                </Col>
            </Row>
          </Card>
        </Col>

        {/* CỘT PHẢI: SHORTCUT */}
        <Col span={10} xs={24} md={10}>
          <Card title="Truy Cập Nhanh" bordered={false} style={{ height: '100%' }}>
            <Button block size="large" icon={<DollarCircleOutlined />} style={{ height: 50, marginBottom: 16, borderColor: '#52c41a', color: '#52c41a' }} onClick={() => navigate('/bao-cao')}>
                Xem Phiếu Lương
            </Button>
            <Button block size="large" type="primary" ghost style={{ height: 50 }} onClick={() => navigate('/thuong-phat')}>
                Xem Thưởng / Phạt
            </Button>
            
            <Divider orientation="left" style={{ fontSize: 12, color: '#999' }}>Hỗ trợ</Divider>
            <p><PhoneOutlined /> Hotline: 1900 1234</p>
            <p><MailOutlined /> Email: ms@company.com</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDashboard;