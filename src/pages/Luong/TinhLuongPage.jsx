import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, message, Descriptions, Tag, Divider } from 'antd';
import { CalculatorOutlined, DollarCircleOutlined } from '@ant-design/icons';
import luongApi from '../../api/luongApi';
import dayjs from 'dayjs';

const TinhLuongPage = () => {
  const [loading, setLoading] = useState(false);
  const [ketQua, setKetQua] = useState(null); 

  const onFinish = async (values) => {
    setLoading(true);
    setKetQua(null); 
    try {
      //1.Chuẩn bị dữ liệu gửi đi
      const payload = {
        ma_nhan_vien: values.ma_nhan_vien,
        thang: values.thang_nam.month() + 1, 
        nam: values.thang_nam.year()
      };

      //2.Gọi API
      const res = await luongApi.tinhLuong(payload);
      
      //3 Hiển thị kết quả
      message.success(res.data.message);
      setKetQua(res.data.data);
      
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi tính lương');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>💰 Tính Lương Nhân Viên</h2>
      
      {/* FORM NHẬP LIỆU */}
      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Form layout="inline" onFinish={onFinish} initialValues={{ thang_nam: dayjs() }}>
          <Form.Item
            name="ma_nhan_vien"
            rules={[{ required: true, message: 'Vui lòng nhập Mã NV' }]}
          >
            <Input placeholder="Mã NV (VD: NV003)" prefix={<DollarCircleOutlined />} />
          </Form.Item>

          <Form.Item
            name="thang_nam"
            rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}
          >
            <DatePicker picker="month" placeholder="Chọn tháng lương" format="MM/YYYY" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<CalculatorOutlined />} loading={loading}>
              Chạy Tính Lương
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* HIỂN THỊ KẾT QUẢ (Phiếu lương) */}
      {ketQua && (
        <Card 
            style={{ marginTop: 24, borderTop: '4px solid #52c41a' }} 
            title={<span><DollarCircleOutlined /> PHIẾU LƯƠNG CHI TIẾT</span>}
        >
          <Descriptions bordered column={1} labelStyle={{ width: '200px', fontWeight: 'bold' }}>
            <Descriptions.Item label="Nhân Viên">
                <Tag color="blue">{ketQua.ma_nhan_vien}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kỳ Lương">
                {`Tháng ${ketQua.thang} / Năm ${ketQua.nam}`}
            </Descriptions.Item>
            
            <Descriptions.Item label="Tổng Giờ Làm">
              {ketQua.tong_gio_lam} giờ
            </Descriptions.Item>
            
            <Descriptions.Item label="Lương Cơ Bản">
              {Number(ketQua.luong_co_ban).toLocaleString('vi-VN')} VNĐ
            </Descriptions.Item>
            
            <Descriptions.Item label="Lương Làm Thêm (OT)">
              {Number(ketQua.luong_them_gio).toLocaleString('vi-VN')} VNĐ
            </Descriptions.Item>
            
            <Descriptions.Item label="TỔNG THỰC NHẬN" contentStyle={{ fontSize: 20, color: '#cf1322', fontWeight: 'bold' }}>
              {Number(ketQua.tong_luong).toLocaleString('vi-VN')} VNĐ
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default TinhLuongPage;