import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  BankOutlined, TeamOutlined, PartitionOutlined, DollarOutlined 
} from '@ant-design/icons';

const StatCard = ({ title, value, icon, color, suffix, isCurrency }) => (
  <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
      <Statistic 
          title={<span style={{ fontWeight: 600, color: '#888' }}>{title}</span>} 
          value={value} 
          precision={isCurrency ? 0 : 0}
          valueStyle={{ color: color, fontWeight: 'bold', fontSize: 24 }} 
          prefix={icon} 
          suffix={suffix}
          formatter={isCurrency ? (val) => 
            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) 
            : undefined}
      />
  </Card>
);

const GeneralStats = ({ stats }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 8 }}>
      <Col span={6}>
        <StatCard title="Tổng Nhân Viên" value={stats.totalNhanVien} icon={<TeamOutlined />} color="#3f8600" suffix="người" />
      </Col>
      <Col span={6}>
        <StatCard title="Tổng Phòng Ban" value={stats.totalPhongBan} icon={<BankOutlined />} color="#1890ff" suffix="phòng" />
      </Col>
      <Col span={6}>
        <StatCard title="Tổng Chức Vụ" value={stats.totalChucVu} icon={<PartitionOutlined />} color="#722ed1" suffix="vị trí" />
      </Col>
      <Col span={6}>
        <StatCard title="Quỹ Lương Tháng" value={stats.totalSalary} icon={<DollarOutlined />} color="#cf1322" isCurrency={true} />
      </Col>
    </Row>
  );
};

export default GeneralStats;