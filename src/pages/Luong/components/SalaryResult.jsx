import React from 'react';
import { Card, Descriptions, Tag } from 'antd';
import { DollarCircleOutlined } from '@ant-design/icons';

const SalaryResult = ({ data }) => {
  if (!data) return null;

  return (
    <Card 
        style={{ marginTop: 24, borderTop: '4px solid #52c41a' }} 
        title={<span><DollarCircleOutlined /> PHIẾU LƯƠNG CHI TIẾT</span>}
    >
      <Descriptions bordered column={1} labelStyle={{ width: '200px', fontWeight: 'bold' }}>
        <Descriptions.Item label="Nhân Viên">
            <Tag color="blue" style={{ fontSize: 14 }}>{data.ma_nhan_vien}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Kỳ Lương">
            {`Tháng ${data.thang} / Năm ${data.nam}`}
        </Descriptions.Item>
        
        <Descriptions.Item label="Tổng Giờ Làm">
          <b>{data.tong_gio_lam} giờ</b>
        </Descriptions.Item>
        
        <Descriptions.Item label="Lương Cơ Bản">
          {Number(data.luong_co_ban).toLocaleString('vi-VN')} VNĐ
        </Descriptions.Item>
        
        <Descriptions.Item label="Lương Làm Thêm (OT)">
          {Number(data.luong_them_gio).toLocaleString('vi-VN')} VNĐ
        </Descriptions.Item>
        
        <Descriptions.Item label="TỔNG THỰC NHẬN" contentStyle={{ fontSize: 20, color: '#cf1322', fontWeight: 'bold' }}>
          {Number(data.tong_luong).toLocaleString('vi-VN')} VNĐ
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default SalaryResult;