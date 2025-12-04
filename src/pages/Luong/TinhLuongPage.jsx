import React, { useState, useEffect } from 'react';
import { message, Spin, Table, Tag, Card, Typography } from 'antd';
import { DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import luongApi from '../../api/luongApi';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';
import SalaryFilter from './components/SalaryFilter';
import SalaryResult from './components/SalaryResult';

const { Text } = Typography;

const TinhLuongPage = () => {
  const [loading, setLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [ketQua, setKetQua] = useState(null);

  // State Dữ liệu
  const [listNhanVien, setListNhanVien] = useState([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);

  // State Form
  const [selectedPhong, setSelectedPhong] = useState(undefined);
  const [selectedChucVu, setSelectedChucVu] = useState(undefined);
  const [targetMaNV, setTargetMaNV] = useState(undefined);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  // 1. Tải dữ liệu danh mục
  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoading(true);
      try {
        const [resNV, resPB, resCV] = await Promise.all([
          nhanVienApi.getAll(),
          phongBanApi.getAll(),
          chucVuApi.getAll()
        ]);

        setListNhanVien(Array.isArray(resNV) ? resNV : []);
        setFilteredNhanVien(Array.isArray(resNV) ? resNV : []);
        setListPhongBan(Array.isArray(resPB) ? resPB : []);
        setListChucVu(Array.isArray(resCV) ? resCV : []);
      } catch (error) { console.error("Lỗi tải dữ liệu:", error); } finally { setLoading(false); }
    };
    fetchCatalogs();
  }, []);

  // 2. Lọc nhân viên
  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    setFilteredNhanVien(result);
    if (targetMaNV && !result.find(nv => nv.ma_nhan_vien === targetMaNV)) setTargetMaNV(undefined);
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  //  HÀM TẠO MESSAGE 
  const generateSuccessMessage = (count) => {
      const tenPhong = listPhongBan.find(p => p.ma_phong === selectedPhong)?.ten_phong;
      const tenChucVu = listChucVu.find(c => c.ma_chuc_vu === selectedChucVu)?.ten_chuc_vu;

      if (selectedPhong && selectedChucVu) {
          return `Hoàn tất! Đã tính lương cho ${count} ${tenChucVu} thuộc ${tenPhong}.`;
      }
      if (selectedPhong) {
          return `Hoàn tất! Đã tính lương cho ${count} nhân viên thuộc ${tenPhong}.`;
      }
      if (selectedChucVu) {
          return `Hoàn tất! Đã tính lương cho ${count} nhân viên giữ chức vụ ${tenChucVu}.`;
      }
      return `Hoàn tất! Đã tính lương cho toàn bộ công ty (${count} nhân viên).`;
  };

  // 3. Xử lý tính lương
  const handleCalculate = async () => {
    setCalcLoading(true);
    setKetQua(null);
    try {
      const payload = {
        ma_nhan_vien: targetMaNV, 
        ma_phong: selectedPhong,      
        ma_chuc_vu: selectedChucVu,   
        thang: selectedMonth.month() + 1,
        nam: selectedMonth.year()
      };

      const res = await luongApi.tinhLuong(payload);
      const responseData = res.data;

      // CASE 1: Tính Batch (Nhiều người) -> Hiện Table
      if (responseData.isBatch || (!targetMaNV && Array.isArray(responseData.data))) {
          setKetQua(responseData.data);
          const msg = generateSuccessMessage(responseData.data.length); 
          message.success(msg);
      } 
      // CASE 2: Tính 1 người -> Hiện Card Result
      else {
          message.success(`Đã cập nhật lương cho nhân viên ${targetMaNV}`);
          if (responseData.data) setKetQua(responseData.data); 
      }

    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Lỗi khi tính lương');
    } finally {
      setCalcLoading(false);
    }
  };

  // CẤU HÌNH CỘT TABLE 
  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'ma_nhan_vien',
      key: 'ma_nhan_vien',
      width: 120,
      render: (text) => <Tag color="#108ee9" style={{ fontWeight: 600 }}>{text}</Tag>
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'ten_nhan_vien',
      key: 'ten_nhan_vien',
      render: (text) => <Text strong style={{ fontSize: 15 }}>{text}</Text>
    },
    {
      title: 'Tổng Thực Nhận',
      dataIndex: 'tong_luong',
      key: 'tong_luong',
      align: 'right',
      width: 200,
      render: (value) => (
        <div style={{ 
            color: '#cf1322', 
            fontWeight: 'bold', 
            fontSize: '16px',
            background: '#fff1f0', 
            padding: '4px 12px', 
            borderRadius: '4px',
            display: 'inline-block',
            border: '1px solid #ffa39e'
        }}>
          {Number(value).toLocaleString('vi-VN')} đ
        </div>
      )
    }
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
      <h2 style={{ marginBottom: 24, color: '#001529' }}>💰 Tính Lương (Payroll)</h2>
      
      <SalaryFilter 
        listPhongBan={listPhongBan} listChucVu={listChucVu} filteredNhanVien={filteredNhanVien}
        selectedPhong={selectedPhong} setSelectedPhong={setSelectedPhong}
        selectedChucVu={selectedChucVu} setSelectedChucVu={setSelectedChucVu}
        targetMaNV={targetMaNV} setTargetMaNV={setTargetMaNV}
        selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
        onCalculate={handleCalculate} loading={calcLoading}
      />

      {/* HIỂN THỊ KẾT QUẢ DẠNG BẢNG (KHI TÍNH NHIỀU NGƯỜI) */}
      {Array.isArray(ketQua) && ketQua.length > 0 && (
        <Card
          title={<span><TeamOutlined /> BẢNG KẾT QUẢ TÍNH LƯƠNG</span>}
          bordered={false}
          style={{ 
              marginTop: 24, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
              borderRadius: '8px' 
          }}
          headStyle={{ borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}
        >
            <Table 
              columns={columns} 
              dataSource={ketQua} 
              rowKey="ma_nhan_vien"
              pagination={{ pageSize: 8, showTotal: (total) => `Tổng ${total} nhân viên` }}
              bordered
              size="middle"
              rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
        </Card>
      )}

      {/* HIỂN THỊ KẾT QUẢ DẠNG PHIẾU (KHI TÍNH 1 NGƯỜI) */}
      {ketQua && !Array.isArray(ketQua) && (
        <SalaryResult data={ketQua} />
      )}

    </div>
  );
};

export default TinhLuongPage;