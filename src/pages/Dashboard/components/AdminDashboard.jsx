import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import dayjs from 'dayjs';
import nhanVienApi from '../../../api/nhanVienApi';
import phongBanApi from '../../../api/phongBanApi';
import chucVuApi from '../../../api/chucVuApi';
import GeneralStats from './charts/GeneralStats';
import AttendanceChart from './charts/AttendanceChart';
import SalaryChart from './charts/SalaryChart';
import StructureChart from './charts/StructureChart';
import RecruitmentChart from './charts/RecruitmentChart';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  // State dữ liệu tổng
  const [stats, setStats] = useState({ totalNhanVien: 0, totalPhongBan: 0, totalChucVu: 0, totalSalary: 0 });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [areaData, setAreaData] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Gọi API song song
        const [resNV, resPB, resCV] = await Promise.all([
            nhanVienApi.getAll().catch(() => ({ data: { data: [] } })),
            phongBanApi.getAll().catch(() => ({ data: { data: [] } })),
            chucVuApi.getAll().catch(() => ({ data: { data: [] } }))
        ]);

        const listNV = resNV.data?.data || [];
        const listPB = Array.isArray(resPB.data) ? resPB.data : (resPB.data?.data || []);
        const listCV = Array.isArray(resCV.data) ? resCV.data : (resCV.data?.data || []);

        // 1. Tính toán thống kê tổng (Header)
        const totalSalary = listNV.reduce((sum, nv) => sum + parseFloat(nv.muc_luong_co_ban || 0), 0);
        setStats({
          totalNhanVien: listNV.length,
          totalPhongBan: listPB.length,
          totalChucVu: listCV.length,
          totalSalary: totalSalary, 
        });

        // 2. Xử lý dữ liệu Lương & Cơ cấu (SalaryChart + StructureChart)
        const deptStats = {}; 
        listNV.forEach(nv => {
          const tenPhong = nv.phongBan?.ten_phong || 'Chưa phân bổ';
          const luong = parseFloat(nv.muc_luong_co_ban || 0);

          if (!deptStats[tenPhong]) deptStats[tenPhong] = { count: 0, totalSalary: 0 };
          deptStats[tenPhong].count += 1;
          deptStats[tenPhong].totalSalary += luong;
        });

        setPieData(Object.keys(deptStats).map(key => ({ name: key, value: deptStats[key].count })));
        setBarData(Object.keys(deptStats).map(key => ({ name: key, quyLuong: deptStats[key].totalSalary })));

        // 3. Xử lý dữ liệu Tuyển dụng (RecruitmentChart)
        const currentYear = dayjs().year();
        const recruitmentByMonth = Array(12).fill(0);
        listNV.forEach(nv => {
          if (nv.ngay_vao_lam && dayjs(nv.ngay_vao_lam).year() === currentYear) {
            recruitmentByMonth[dayjs(nv.ngay_vao_lam).month()] += 1;
          }
        });
        setAreaData(recruitmentByMonth.map((count, index) => ({ name: `T${index + 1}`, TuyenMoi: count })));

      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large"/></div>;

  return (
    <>
      <h2 style={{ marginBottom: 24, fontWeight: 700, color: '#262626' }}>📊 Dashboard Quản Trị</h2>

      {/* 1. Thống kê tổng quan */}
      <GeneralStats stats={stats} />

      {/* 2. Biểu đồ chuyên cần (Tự quản lý logic API bên trong) */}
      <AttendanceChart />

      {/* 3. Các biểu đồ thống kê khác */}
      <Row gutter={16}>
        <Col span={16}>
          <SalaryChart data={barData} />
        </Col>
        <Col span={8}>
          <StructureChart data={pieData} />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <RecruitmentChart data={areaData} />
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;