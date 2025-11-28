import React from 'react';
import { Table, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const SalarySummary = ({ data, year, onViewDetail }) => {
  const columns = [
    { title: 'Mã NV', dataIndex: 'ma_nhan_vien', width: 100 },
    { title: 'Họ Tên', dataIndex: 'ten_nhan_vien' },
    { title: 'Phòng', dataIndex: ['phongBan', 'ten_phong'], render: t => t || '-' },
    { title: 'Chức Vụ', dataIndex: ['chucVu', 'ten_chuc_vu'], render: t => t || '-' },
    { 
      title: `Tổng Thu Nhập ${year}`, 
      dataIndex: 'tongThuNhap', align: 'right',
      sorter: (a, b) => a.tongThuNhap - b.tongThuNhap,
      render: (v, r) => r.coDuLieu ? <b style={{ color: '#1890ff' }}>{Number(v).toLocaleString()} đ</b> : <span style={{color:'#ccc'}}>Chưa có HL</span>
    },
    {
      title: 'Chi tiết', align: 'center',
      render: (_, record) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => onViewDetail(record.ma_nhan_vien)}>Xem</Button>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, fontWeight: 'bold', fontSize: 16 }}>
        Kết quả tổng hợp: {data.length} nhân viên (Năm {year})
      </div>
      <Table 
        columns={columns} dataSource={data} rowKey="ma_nhan_vien" 
        bordered pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default SalarySummary;