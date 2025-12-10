import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2, AlertCircle } from 'react-feather';

const SalaryChart = ({ data }) => {
  // Định nghĩa màu gradient cho các cột
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

  return (
    <div className="card-custom">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <BarChart2 size={20} className="text-primary"/> Thống Kê Tổng Lương Thực Tế Của Từng Phòng Ban
        </h3>
        {data && data.length > 0 && (
          <span className="text-sm text-gray-500">
            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              data.reduce((sum, item) => sum + (item.quyLuong || 0), 0)
            )}
          </span>
        )}
      </div>
      <div className="w-full h-[400px]">
        {!data || data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <AlertCircle size={48} className="text-amber-400" />
            <div className="text-center">
              <p className="font-semibold text-lg">Chưa có dữ liệu lương</p>
              <p className="text-sm mt-1">Vui lòng tính lương cho tháng này để xem biểu đồ</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                interval={0} 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
                axisLine={false} 
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                width={100} 
                tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                formatter={(value) => [
                  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 
                  'Tổng Lương'
                ]} 
              />
              <Bar dataKey="quyLuong" fill="#3b82f6" barSize={60} radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalaryChart;