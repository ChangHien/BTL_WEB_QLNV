import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { BankOutlined, TeamOutlined, PartitionOutlined, DollarOutlined } from '@ant-design/icons';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  AreaChart, Area 
} from 'recharts';
import dayjs from 'dayjs'; 

import nhanVienApi from '../../../api/nhanVienApi';
// import phongBanApi from '../../../api/phongBanApi';
// import chucVuApi from '../../../api/chucVuApi';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalNhanVien: 0, totalPhongBan: 0, totalChucVu: 0 });
  
 
  const [pieData, setPieData] = useState([]); // Phân bố phòng ban
  const [barData, setBarData] = useState([]); // Quỹ lương phòng ban
  const [areaData, setAreaData] = useState([]); // Xu hướng tuyển dụng

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        //1. GỌI CÁC API
        let listNV = [];
        let listPB = [];
        let listCV = [];

        try {
            const resNV = await nhanVienApi.getAll();
            listNV = resNV.data.data || [];
        } catch (e) { console.error("Lỗi NV", e); }

        try {
            const resPB = await phongBanApi.getAll();
            listPB = resPB.data.data || [];
        } catch (e) { console.warn("Lỗi PB", e); }

        try {
            const resCV = await chucVuApi.getAll();
            listCV = resCV.data.data || [];
        } catch (e) { console.warn("Lỗi CV", e); }

        //2. CẬP NHẬT SỐ LIỆU TỔNG QUAN
        setStats({
          totalNhanVien: listNV.length,
          totalPhongBan: listPB.length,
          totalChucVu: listCV.length,
        });

        //3. XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ (DATA PROCESSING)

        //A. Biểu đồ Tròn & Cột: Gom nhóm theo Phòng Ban
        const deptStats = {}; 

        listNV.forEach(nv => {
          const tenPhong = nv.phongBan?.ten_phong || 'Chưa phân bổ';
          const luong = parseFloat(nv.muc_luong_co_ban || 0);

          if (!deptStats[tenPhong]) {
            deptStats[tenPhong] = { count: 0, totalSalary: 0 };
          }
          deptStats[tenPhong].count += 1;
          deptStats[tenPhong].totalSalary += luong;
        });

        //Convert sang mảng cho Recharts
        const processedPieData = Object.keys(deptStats).map(key => ({
          name: key,
          value: deptStats[key].count
        }));
        
        const processedBarData = Object.keys(deptStats).map(key => ({
          name: key,
          nhanSu: deptStats[key].count,
          quyLuong: deptStats[key].totalSalary
        }));

        //B. Biểu đồ Vùng: Xu hướng tuyển dụng năm nay (2025)
        const currentYear = dayjs().year();
        const recruitmentByMonth = Array(12).fill(0);
        listNV.forEach(nv => {
            if (nv.ngay_vao_lam) {
                const date = dayjs(nv.ngay_vao_lam);
                if (date.year() === currentYear) {
                    const monthIndex = date.month(); 
                    recruitmentByMonth[monthIndex] += 1;
                }
            }
        });

        const processedAreaData = recruitmentByMonth.map((count, index) => ({
            name: `T${index + 1}`,
            TuyenMoi: count
        }));

        setPieData(processedPieData);
        setBarData(processedBarData);
        setAreaData(processedAreaData);

      } catch (error) {
        console.error("Lỗi chung Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large"/></div>;

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>📊 Dashboard </h2>
      
      {/* Hàng 1: Thẻ Số liệu */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card><Statistic title="Tổng Nhân Viên" value={stats.totalNhanVien} icon={<TeamOutlined />} valueStyle={{ color: '#3f8600' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="Tổng Phòng Ban" value={stats.totalPhongBan} icon={<BankOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="Tổng Chức Vụ" value={stats.totalChucVu} icon={<PartitionOutlined />} valueStyle={{ color: '#722ed1' }} /></Card></Col>
      </Row>

      {/* Hàng 2: Biểu đồ Cột & Tròn */}
      <Row gutter={16}>
        {/* Biểu đồ Cột: Quỹ lương theo phòng ban */}
        <Col span={16} xs={24} md={16}>
          <Card title="💰 Quỹ Lương Cơ Bản Theo Phòng Ban" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                <Legend />
                <Bar dataKey="quyLuong" name="Tổng Quỹ Lương" fill="#82ca9d" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Biểu đồ Tròn: Cơ cấu nhân sự */}
        <Col span={8} xs={24} md={8}>
          <Card title="🍰 Cơ Cấu Nhân Sự" style={{ marginBottom: 16, height: 402 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => [value + ' người', 'Số lượng']} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Hàng 3: Biểu đồ Vùng - Xu hướng tuyển dụng */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title={`📈 Xu Hướng Tuyển Dụng Năm ${dayjs().year()}`}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="TuyenMoi" name="Nhân viên mới" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;