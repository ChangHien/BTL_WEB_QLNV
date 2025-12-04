import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import dayjs from 'dayjs';

// API
import luongApi from '../../api/luongApi';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';

// Components
import SalaryFilter from './components/SalaryFilter';
import SalaryResult from './components/SalaryResult';

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
          nhanVienApi.getAll(), phongBanApi.getAll(), chucVuApi.getAll()
        ]);
        
        const allNV = resNV.data.data || [];
        setListNhanVien(allNV);
        setFilteredNhanVien(allNV);
        
        setListPhongBan(Array.isArray(resPB.data) ? resPB.data : []);
        setListChucVu(Array.isArray(resCV.data) ? resCV.data : []);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchCatalogs();
  }, []);

  // 2. Lọc nhân viên tự động
  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    setFilteredNhanVien(result);
    if (targetMaNV && !result.find(nv => nv.ma_nhan_vien === targetMaNV)) setTargetMaNV(undefined);
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  // 3. Xử lý tính lương
  const handleCalculate = async () => {
    setCalcLoading(true);
    setKetQua(null);
    try {
      const payload = {
        ma_nhan_vien: targetMaNV, 
        ma_phong: selectedPhong,      // Gửi mã phòng để BE lọc
        ma_chuc_vu: selectedChucVu,   // Gửi mã chức vụ để BE lọc
        thang: selectedMonth.month() + 1,
        nam: selectedMonth.year()
      };

      const res = await luongApi.tinhLuong(payload);
      message.success(res.data.message);
      
      if (res.data.data && targetMaNV) { 
        setKetQua(res.data.data); // Chỉ hiện kết quả nếu tính cho 1 người
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
      <SalaryFilter 
        listPhongBan={listPhongBan} listChucVu={listChucVu} filteredNhanVien={filteredNhanVien}
        selectedPhong={selectedPhong} setSelectedPhong={setSelectedPhong}
        selectedChucVu={selectedChucVu} setSelectedChucVu={setSelectedChucVu}
        targetMaNV={targetMaNV} setTargetMaNV={setTargetMaNV}
        selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
        onCalculate={handleCalculate} loading={calcLoading}
      />
      {targetMaNV && <SalaryResult data={ketQua} />}
    </div>
  );
};

export default TinhLuongPage;