import React, { useEffect, useState } from 'react';
import { Card, Select, Spin } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import chamCongApi from '../../../../api/chamCongApi'; 

const ATTENDANCE_COLORS = {
  'Đúng giờ': '#52c41a',
  'Đi muộn': '#faad14',
  'Về sớm': '#ff4d4f',
  'Vắng phép': '#722ed1'
};

const AttendanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thang, setThang] = useState(dayjs().month() + 1);
  const [nam, setNam] = useState(dayjs().year());

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const res = await chamCongApi.getThongKeBieuDo(thang, nam);
        const data = res.data.data;

        const processedData = [];
        if (data.DungGio > 0) processedData.push({ name: 'Đúng giờ', value: data.DungGio, fill: ATTENDANCE_COLORS['Đúng giờ'] });
        if (data.DiMuon > 0) processedData.push({ name: 'Đi muộn', value: data.DiMuon, fill: ATTENDANCE_COLORS['Đi muộn'] });
        if (data.VeSom > 0) processedData.push({ name: 'Về sớm', value: data.VeSom, fill: ATTENDANCE_COLORS['Về sớm'] });
        if (data.NghiPhep > 0) processedData.push({ name: 'Vắng phép', value: data.NghiPhep, fill: ATTENDANCE_COLORS['Vắng phép'] });

        setChartData(processedData);
      } catch (err) {
        console.error("Lỗi load thống kê chuyên cần", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [thang, nam]);

  return (
    <Card title={`📅 Tình Hình Chuyên Cần Tháng ${thang}/${nam}`} style={{ marginBottom: 20, borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <span style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>Thời gian:</span>
        <Select
          value={thang} style={{ width: 120 }} onChange={setThang}
          options={Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))}
        />
        <Select
          value={nam} style={{ width: 120 }} onChange={setNam}
          options={[2024, 2025, 2026].map(y => ({ label: y, value: y }))}
        />
      </div>

      <div style={{ height: 320 }}>
        {loading ? <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin /></div> :
          chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData} cx="50%" cy="50%" dataKey="value" nameKey="name"
                  outerRadius={110} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${value} lượt`, 'Số lượng']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: 100, color: '#999' }}>Chưa có dữ liệu chấm công tháng này</div>
          )}
      </div>
    </Card>
  );
};

export default AttendanceChart;