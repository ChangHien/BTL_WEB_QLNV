import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Button, Table, Row, Col, Statistic, message, Tag } from 'antd';
import { SearchOutlined, DollarOutlined } from '@ant-design/icons';
import luongApi from '../../api/luongApi';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const BaoCaoThuNhap = () => {
  const { user } = useAuth(); // Lấy thông tin user đang đăng nhập
  const [data, setData] = useState([]);
  const [tongNam, setTongNam] = useState(0);
  const [year, setYear] = useState(dayjs().year()); // Mặc định năm nay
  const [loading, setLoading] = useState(false);

  const fetchBaoCao = async () => {
    setLoading(true);
    try {
      // Nếu là Admin/HR thì có thể xem của người khác (cần làm thêm ô nhập mã NV)
      // Nhưng tạm thời cứ lấy của chính mình để test trước
      const targetMaNV = user.ma_nhan_vien; 

      console.log(`Đang lấy báo cáo cho ${targetMaNV} năm ${year}`);
      const res = await luongApi.getThongKeNam(targetMaNV, year);
      
      // Backend trả về: { tong_thu_nhap_nam, chi_tiet_theo_thang }
      setData(res.data.chi_tiet_theo_thang);
      setTongNam(res.data.tong_thu_nhap_nam);
      message.success('Lấy dữ liệu thành công');
      
    } catch (error) {
      console.error(error);
      message.warning('Chưa có dữ liệu lương cho năm này.');
      setData([]);
      setTongNam(0);
    } finally {
      setLoading(false);
    }
  };

  // Tự động tải khi vào trang
  useEffect(() => {
    if (user) fetchBaoCao();
  }, [user]);

  const columns = [
    { 
      title: 'Tháng', 
      dataIndex: 'thang', 
      key: 'thang',
      render: t => <Tag color="blue">Tháng {t}</Tag> 
    },
    { 
      title: 'Lương Cơ Bản', 
      dataIndex: 'luong_co_ban', 
      key: 'lcb', 
      render: v => Number(v).toLocaleString() + ' đ'
    },
    { 
      title: 'Làm Thêm (OT)', 
      dataIndex: 'luong_them_gio', 
      key: 'ot', 
      render: v => Number(v).toLocaleString() + ' đ'
    },
    { 
      title: 'Thực Nhận', 
      dataIndex: 'tong_luong', 
      key: 'total', 
      render: v => <b style={{ color: '#389e0d', fontSize: 16 }}>{Number(v).toLocaleString()} đ</b> 
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>📊 Báo Cáo Thu Nhập Cá Nhân</h2>
      
      {/* Bộ lọc */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>Chọn Năm:</span>
          <DatePicker 
            picker="year" 
            defaultValue={dayjs()}
            onChange={(d) => setYear(d ? d.year() : 2025)} 
            style={{ width: 120 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchBaoCao} loading={loading}>
            Xem Báo Cáo
          </Button>
        </div>
      </Card>

      <Row gutter={16}>
        {/* Bảng chi tiết */}
        <Col span={16}>
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="thang" 
            pagination={false} 
            bordered
            loading={loading}
          />
        </Col>
        
        {/* Thẻ tổng kết */}
        <Col span={8}>
          <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f', textAlign: 'center' }}>
            <Statistic 
              title={`Tổng Thu Nhập Năm ${year}`} 
              value={tongNam} 
              precision={0} 
              suffix="VNĐ" 
              valueStyle={{ color: '#389e0d', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BaoCaoThuNhap;