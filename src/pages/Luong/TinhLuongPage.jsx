import React, { useState, useEffect } from 'react';
import { Card, Form, Button, DatePicker, message, Descriptions, Tag, Select, Row, Col, Spin, Alert } from 'antd';
import { CalculatorOutlined, DollarCircleOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import luongApi from '../../api/luongApi';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';

const { Option } = Select;

const TinhLuongPage = () => {
  const [loading, setLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [ketQua, setKetQua] = useState(null);

  const [listNhanVien, setListNhanVien] = useState([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);

  const [selectedPhong, setSelectedPhong] = useState(undefined);
  const [selectedChucVu, setSelectedChucVu] = useState(undefined);
  const [targetMaNV, setTargetMaNV] = useState(undefined);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  // 1. TẢI DỮ LIỆU BAN ĐẦU
  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoading(true);
      try {
        const [resNV, resPB, resCV] = await Promise.all([
          nhanVienApi.getAll(),
          phongBanApi.getAll(),
          chucVuApi.getAll()
        ]);

        const allNV = resNV.data.data || [];
        setListNhanVien(allNV);
        setFilteredNhanVien(allNV);
        
        setListPhongBan(Array.isArray(resPB.data) ? resPB.data : []);
        setListChucVu(Array.isArray(resCV.data) ? resCV.data : []);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  // 2. LOGIC LỌC NHÂN VIÊN TỰ ĐỘNG
  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    
    setFilteredNhanVien(result);
    
    if (targetMaNV && !result.find(nv => nv.ma_nhan_vien === targetMaNV)) {
      setTargetMaNV(undefined);
    }
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  // 3. XỬ LÝ TÍNH LƯƠNG
  const handleCalculate = async () => {
    setCalcLoading(true);
    setKetQua(null);
    try {
      const payload = {
        ma_nhan_vien: targetMaNV, 
        thang: selectedMonth.month() + 1,
        nam: selectedMonth.year()
      };

      const res = await luongApi.tinhLuong(payload);
      
      message.success(res.data.message);
      
      if (res.data.data) {
        setKetQua(res.data.data);
      } 
      
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi tính lương');
    } finally {
      setCalcLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>💰 Tính Lương (Payroll)</h2>
      
      {/* KHU VỰC BỘ LỌC THÔNG MINH  */}
      <Card 
        title={<span><FilterOutlined /> Chọn đối tượng tính lương</span>} 
        style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Row gutter={16}>
          {/* Lọc Phòng Ban */}
          <Col span={6}>
            <div style={{ marginBottom: 5, fontWeight: 500 }}>Phòng ban:</div>
            <Select 
              placeholder="Tất cả" style={{ width: '100%' }} allowClear
              value={selectedPhong} onChange={setSelectedPhong}
            >
              {listPhongBan.map(pb => <Option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</Option>)}
            </Select>
          </Col>

          {/* Lọc Chức Vụ */}
          <Col span={6}>
            <div style={{ marginBottom: 5, fontWeight: 500 }}>Chức vụ:</div>
            <Select 
              placeholder="Tất cả" style={{ width: '100%' }} allowClear
              value={selectedChucVu} onChange={setSelectedChucVu}
            >
              {listChucVu.map(cv => <Option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</Option>)}
            </Select>
          </Col>

          {/* Chọn Nhân Viên */}
          <Col span={12}>
            <div style={{ marginBottom: 5, fontWeight: 500 }}>Nhân viên cụ thể:</div>
            <Select
              showSearch
              placeholder="Chọn nhân viên (Bỏ trống = Tính cho toàn bộ)"
              style={{ width: '100%' }}
              allowClear
              value={targetMaNV}
              onChange={setTargetMaNV}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
            >
              {filteredNhanVien.map(nv => (
                <Option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                  {`${nv.ten_nhan_vien} (${nv.ma_nhan_vien})`}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          {/* Chọn Tháng */}
          <Col span={12}>
            <div style={{ marginBottom: 5, fontWeight: 500 }}>Kỳ lương:</div>
            <DatePicker 
              picker="month" 
              format="MM/YYYY"
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val || dayjs())}
              style={{ width: '100%' }} 
              allowClear={false}
            />
          </Col>

          {/* Nút Hành Động */}
          <Col span={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<CalculatorOutlined />} 
              onClick={handleCalculate} 
              loading={calcLoading}
              style={{ width: '100%', height: 40, fontWeight: 'bold' }}
            >
              {targetMaNV ? `Tính lương cho ${targetMaNV}` : 'Payroll'}
            </Button>
          </Col>
        </Row>

        
      </Card>

      {/*KẾT QUẢ (PHIẾU LƯƠNG)*/}
      {/* Chỉ hiện khi tính cho 1 người cụ thể */}
      {ketQua && targetMaNV && (
        <Card 
            style={{ marginTop: 24, borderTop: '4px solid #52c41a' }} 
            title={<span><DollarCircleOutlined /> PHIẾU LƯƠNG CHI TIẾT</span>}
        >
          <Descriptions bordered column={1} labelStyle={{ width: '200px', fontWeight: 'bold' }}>
            <Descriptions.Item label="Nhân Viên">
                <Tag color="blue" style={{ fontSize: 14 }}>{ketQua.ma_nhan_vien}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kỳ Lương">
                {`Tháng ${ketQua.thang} / Năm ${ketQua.nam}`}
            </Descriptions.Item>
            
            <Descriptions.Item label="Tổng Giờ Làm">
              <b>{ketQua.tong_gio_lam} giờ</b>
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