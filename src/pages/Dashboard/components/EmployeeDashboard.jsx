import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import nhanVienApi from '../../../api/nhanVienApi';
import chamCongApi from '../../../api/chamCongApi';
import { useAuth } from '../../../contexts/AuthContext';
import { User, CreditCard, Clock, CheckCircle, AlertTriangle, DollarSign, Phone, Mail, Gift } from 'react-feather';

const STATUS_MAP = { DUNG_GIO: 'DungGio', DI_MUON: 'DiMuon', VE_SOM: 'VeSom' };

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ totalDays: 0, lateDays: 0, onTimeDays: 0, earlyDays: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resProfile = await nhanVienApi.getById(user.ma_nhan_vien);
        setMyProfile(resProfile.data); 
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();
        const listCC = await chamCongApi.getByNhanVien(user.ma_nhan_vien, currentMonth, currentYear);
        
        let late = 0, onTime = 0, early = 0;
        listCC.forEach(cc => {
            if (cc.trang_thai_ca === STATUS_MAP.DUNG_GIO) onTime++;
            else if (cc.trang_thai_ca === STATUS_MAP.DI_MUON) late++;
            else if (cc.trang_thai_ca === STATUS_MAP.VE_SOM) early++;
        });

        setAttendanceStats({ totalDays: listCC.length, lateDays: late, onTimeDays: onTime, earlyDays: early });
        const chartData = [];
        if (early > 0) chartData.push({ name: 'Về sớm', value: early, fill: '#ff4d4f' });
        if (late > 0) chartData.push({ name: 'Đi muộn', value: late, fill: '#faad14' });
        if (onTime > 0) chartData.push({ name: 'Đúng giờ', value: onTime, fill: '#52c41a' });
        setAttendanceData(chartData);
      } catch (error) { console.error("Lỗi tải dữ liệu Dashboard:", error); } finally { setLoading(false); }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!myProfile) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
            <User size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 m-0">Xin chào, {myProfile.ten_nhan_vien}!</h2>
          <p className="text-gray-500 mt-1 flex items-center gap-2">Mã NV: <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-400">{myProfile.ma_nhan_vien}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-24 gap-6">
        <div className="md:col-span-24 lg:col-span-14 flex flex-col gap-6">
          <div className="card-custom">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><CreditCard size={20} className="text-primary"/> Thông Tin Cá Nhân</h3>
            <div className="grid grid-cols-1 gap-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Phòng Ban</span><span className="font-semibold text-gray-800">{myProfile.phongBan?.ten_phong || '---'}</span></div>
                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Chức Vụ</span><span className="font-semibold text-gray-800">{myProfile.chucVu?.ten_chuc_vu || '---'}</span></div>
                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Ngày Vào Làm</span><span className="font-semibold text-gray-800">{myProfile.ngay_vao_lam ? dayjs(myProfile.ngay_vao_lam).format('DD/MM/YYYY') : '---'}</span></div>
                <div className="flex justify-between pt-1"><span className="text-gray-500">Mức Lương CB</span><span className="font-bold text-red-600 text-base">{myProfile.muc_luong_co_ban ? Number(myProfile.muc_luong_co_ban).toLocaleString('vi-VN') : 0} VNĐ</span></div>
            </div>
          </div>

          <div className="card-custom">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><Clock size={20} className="text-primary"/> Thống Kê Tháng {dayjs().month() + 1}</h3>
            <div className="flex flex-col sm:flex-row items-center">
                <div className="w-full sm:w-1/2 p-2">
                    <div className="mb-6"><div className="text-gray-500 text-xs uppercase">Tổng ngày đi làm</div><div className="text-3xl font-bold text-gray-800">{attendanceStats.totalDays} <span className="text-sm font-normal text-gray-400">ngày</span></div></div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-200 pb-1"><span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle size={14}/> Đúng giờ:</span><span className="font-bold">{attendanceStats.onTimeDays}</span></div>
                        <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-200 pb-1"><span className="text-yellow-500 font-medium flex items-center gap-1"><AlertTriangle size={14}/> Đi muộn:</span><span className="font-bold">{attendanceStats.lateDays}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-red-500 font-medium flex items-center gap-1"><Clock size={14}/> Về sớm:</span><span className="font-bold">{attendanceStats.earlyDays}</span></div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 h-[250px]">
                    {attendanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={20} data={attendanceData}>
                                <RadialBar minAngle={15} background={{ fill: '#f3f4f6' }} clockWise dataKey="value" cornerRadius={10}/>
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300"><Clock size={48} className="mb-2"/><span>Chưa có dữ liệu</span></div>
                    )}
                </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-24 lg:col-span-10">
          <div className="card-custom h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Truy Cập Nhanh</h3>
            <button onClick={() => navigate('/bao-cao')} className="w-full mb-4 py-3 px-4 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 font-semibold transition-colors flex items-center justify-center gap-2">
                <DollarSign size={18}/> Xem Phiếu Lương
            </button>
            <button onClick={() => navigate('/thuong-phat')} className="w-full mb-8 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors flex items-center justify-center gap-2">
                <Gift size={18}/> Xem Thưởng / Phạt
            </button>
            <div className="mt-auto border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-3">Hỗ trợ</span>
                <p className="text-gray-600 text-sm mb-2 flex items-center gap-2"><Phone size={14}/> Hotline: <span className="font-medium text-black">1900 1234</span></p>
                <p className="text-gray-600 text-sm flex items-center gap-2"><Mail size={14}/> Email: <span className="font-medium text-black">ms@company.com</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;