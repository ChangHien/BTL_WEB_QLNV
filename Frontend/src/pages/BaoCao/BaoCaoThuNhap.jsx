import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import dayjs from 'dayjs';
import luongApi from '../../api/luongApi';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';
import { useAuth } from '../../contexts/AuthContext';
import SalaryFilter from './components/SalaryFilter';
import SalaryDetail from './components/SalaryDetail';
import SalarySummary from './components/SalarySummary';

const BaoCaoThuNhap = () => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';

  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(dayjs().year());
  const [viewMode, setViewMode] = useState('none'); 

  // Data States
  const [detailData, setDetailData] = useState([]); 
  const [tongNamDetail, setTongNamDetail] = useState(0);
  const [viewingName, setViewingName] = useState('');
  const [summaryData, setSummaryData] = useState([]);

  // Filter States
  const [listNhanVien, setListNhanVien] = useState([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);
  
  const [selectedPhong, setSelectedPhong] = useState(undefined);
  const [selectedChucVu, setSelectedChucVu] = useState(undefined);
  const [targetMaNV, setTargetMaNV] = useState(undefined);

  // 1. Init Data
  useEffect(() => {
    if (isAdminOrHR) {
      const fetchCatalogs = async () => {
        try {
          const [resNV, resPB, resCV] = await Promise.all([
            nhanVienApi.getAll(), phongBanApi.getAll(), chucVuApi.getAll()
          ]);
          const allNV = resNV.data.data || [];
          setListNhanVien(allNV);
          setFilteredNhanVien(allNV);
          setListPhongBan(Array.isArray(resPB.data) ? resPB.data : []);
          setListChucVu(Array.isArray(resCV.data) ? resCV.data : []);
        } catch (error) { console.error(error); }
      };
      fetchCatalogs();
    } else {
      handleFetchDetail(user.ma_nhan_vien);
    }
  }, [user]);

  // 2. Filter Logic
  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    setFilteredNhanVien(result);
    if (targetMaNV && !result.find(nv => nv.ma_nhan_vien === targetMaNV)) setTargetMaNV(undefined);
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  // 3. Handlers
  const handleSearch = () => {
    if (targetMaNV) handleFetchDetail(targetMaNV);
    else handleFetchSummary();
  };

  const handleFetchDetail = async (maNV) => {
    setLoading(true);
    setViewMode('detail');
    try {
      const nvInfo = listNhanVien.find(n => n.ma_nhan_vien === maNV);
      setViewingName(nvInfo ? `${nvInfo.ten_nhan_vien} (${maNV})` : maNV);

      const res = await luongApi.getThongKeNam(maNV, year);
      setDetailData(res.data.chi_tiet_theo_thang);
      setTongNamDetail(res.data.tong_thu_nhap_nam);
      if (isAdminOrHR) message.success(`Đã tải dữ liệu chi tiết.`);
    } catch (error) {
      setDetailData([]); setTongNamDetail(0);
      message.info("Chưa có dữ liệu lương.");
    } finally { setLoading(false); }
  };

  const handleFetchSummary = async () => {
    setLoading(true);
    setViewMode('summary');
    setSummaryData([]);
    try {
      const listTarget = filteredNhanVien;
      if (listTarget.length === 0) {
        message.warning("Không tìm thấy nhân viên nào.");
        setLoading(false); return;
      }
      message.loading({ content: `Đang tính toán cho ${listTarget.length} nhân viên...`, key: 'calc' });

      const promises = listTarget.map(async (nv) => {
        try {
          const res = await luongApi.getThongKeNam(nv.ma_nhan_vien, year);
          return { ...nv, tongThuNhap: res.data.tong_thu_nhap_nam, coDuLieu: true };
        } catch (err) { return { ...nv, tongThuNhap: 0, coDuLieu: false }; }
      });

      const results = await Promise.all(promises);
      setSummaryData(results);
      message.success({ content: "Hoàn tất!", key: 'calc' });
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>
        {isAdminOrHR ? "🔍 Tra Cứu & Thống Kê Thu Nhập" : "📊 Báo Cáo Thu Nhập Cá Nhân"}
      </h2>
      
      {/* FILTER SECTION */}
      {isAdminOrHR && (
        <SalaryFilter 
          listPhongBan={listPhongBan} listChucVu={listChucVu} filteredNhanVien={filteredNhanVien}
          selectedPhong={selectedPhong} setSelectedPhong={setSelectedPhong}
          selectedChucVu={selectedChucVu} setSelectedChucVu={setSelectedChucVu}
          targetMaNV={targetMaNV} setTargetMaNV={setTargetMaNV}
          year={year} setYear={setYear}
          onSearch={handleSearch} loading={loading}
        />
      )}

      {/* CONTENT SECTION */}
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        {viewMode === 'detail' && (
          <SalaryDetail 
            data={detailData} total={tongNamDetail} name={viewingName} year={year} 
            loading={loading} isAdmin={isAdminOrHR} onBack={handleFetchSummary}
          />
        )}

        {viewMode === 'summary' && isAdminOrHR && (
          <SalarySummary data={summaryData} year={year} onViewDetail={handleFetchDetail} />
        )}

        {viewMode === 'none' && isAdminOrHR && (
          <div style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>Vui lòng chọn bộ lọc và bấm "Xem"</div>
        )}
      </Spin>
    </div>
  );
};

export default BaoCaoThuNhap; 