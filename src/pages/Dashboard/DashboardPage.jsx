import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, BankOutlined, DollarOutlined } from '@ant-design/icons';

// Dữ liệu giả (Mock Data) - Thay vì gọi API
const stats = [
  { title: 'Tổng Nhân Viên', value: 150, icon: <UserOutlined />, color: '#3f8600' },
  { title: 'Tổng Phòng Ban', value: 8, icon: <BankOutlined />, color: '#1890ff' },
  { title: 'Quỹ Lương Tháng', value: '2.5 Tỷ', icon: <DollarOutlined />, color: '#cf1322' },
];

const DashboardPage = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Tổng quan hệ thống</h2>
      <Row gutter={16}>
        {stats.map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color }}
                prefix={item.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: 24, background: '#fff', padding: 24, minHeight: 200 }}>
        <h3>Biểu đồ thống kê (Placeholder)</h3>
        <p>Khu vực này sẽ hiển thị biểu đồ tăng trưởng nhân sự...</p>
      </div>
    </div>
  );
};

export default DashboardPage;