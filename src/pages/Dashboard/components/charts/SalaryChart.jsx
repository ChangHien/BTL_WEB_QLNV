import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalaryChart = ({ data }) => {
  return (
    <Card title="💰 Phân Bổ Quỹ Lương Theo Phòng">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
          <Bar dataKey="quyLuong" name="Quỹ lương" fill="#52c41a" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalaryChart;