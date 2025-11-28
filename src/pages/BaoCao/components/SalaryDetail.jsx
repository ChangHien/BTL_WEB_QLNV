import React from 'react';
import { Row, Col, Table, Card, Statistic, Tag, Button } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const SalaryDetail = ({ data, total, name, year, loading, isAdmin, onBack }) => {
  const columns = [
    { title: 'Tháng', dataIndex: 'thang', render: t => <Tag color="blue">Tháng {t}</Tag> },
    { title: 'Lương Cơ Bản', dataIndex: 'luong_co_ban', render: v => Number(v).toLocaleString() },
    { title: 'Làm Thêm (OT)', dataIndex: 'luong_them_gio', render: v => Number(v).toLocaleString() },
    { title: 'Thực Nhận', dataIndex: 'tong_luong', render: v => <b style={{ color: '#389e0d' }}>{Number(v).toLocaleString()}</b> },
  ];

  return (
    <Row gutter={16}>
      <Col span={24} style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16 }}>
          Chi tiết lương của: <Tag color="geekblue" style={{ fontSize: 15, padding: '5px 10px' }}>{name}</Tag>
          Năm <b>{year}</b>
        </div>
        {isAdmin && <Button onClick={onBack}>← Quay lại danh sách</Button>}
      </Col>

      <Col span={16}>
        <Table 
          columns={columns} dataSource={data} rowKey="thang" 
          pagination={false} bordered loading={loading} 
        />
      </Col>
      
      <Col span={8}>
        <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f', textAlign: 'center', position: 'sticky', top: 20 }}>
          <Statistic 
            title={`TỔNG THU NHẬP NĂM ${year}`} 
            value={total} precision={0} suffix="VNĐ" 
            valueStyle={{ color: '#389e0d', fontWeight: 'bold', fontSize: 28 }}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SalaryDetail;