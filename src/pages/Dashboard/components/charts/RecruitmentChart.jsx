import React from 'react';
import { Card } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const RecruitmentChart = ({ data }) => {
  return (
    <Card title={`📈 Xu Hướng Tuyển Dụng Năm ${dayjs().year()}`}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey="TuyenMoi" name="Nhân viên mới" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RecruitmentChart;