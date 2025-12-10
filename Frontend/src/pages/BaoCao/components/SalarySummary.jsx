import React from 'react';
import { Eye, TrendingUp } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const SalarySummary = ({ data, year, onViewDetail }) => {
  const navigate = useNavigate();

  const handleSendToDashboard = () => {
    if (data.length === 0) {
      alert('Chưa có dữ liệu để gửi');
      return;
    }

    // Chỉ navigate về Dashboard, Dashboard sẽ tự động tính lương từ chấm công
    alert('✅ Đang chuyển về Dashboard để hiển thị lương theo phòng ban...');
    navigate('/');
  };

  return (
    <div className="animate-enter">
      <div className="mb-4 flex justify-between items-center">
        <div className="font-bold text-gray-700 text-lg border-l-4 border-primary pl-3">
          Kết quả tổng hợp: <span className="text-primary">{data.length}</span> nhân viên (Năm {year})
        </div>
        <button
          onClick={handleSendToDashboard}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
        >
          <TrendingUp size={18} /> Gửi kết quả lên Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs border-b">
              <tr>
                <th className="px-4 py-3">Mã NV</th>
                <th className="px-4 py-3">Họ Tên</th>
                <th className="px-4 py-3">Phòng</th>
                <th className="px-4 py-3">Chức Vụ</th>
                <th className="px-4 py-3 text-right">Tổng Thu Nhập {year}</th>
                <th className="px-4 py-3 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((r) => (
                <tr key={r.ma_nhan_vien} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-600">{r.ma_nhan_vien}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{r.ten_nhan_vien}</td>
                  <td className="px-4 py-3 text-gray-500">{r.phongBan?.ten_phong || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{r.chucVu?.ten_chuc_vu || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    {r.coDuLieu ? (
                      <b className="text-primary">{Number(r.tongThuNhap).toLocaleString()} đ</b>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Chưa có HL</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => onViewDetail(r.ma_nhan_vien)} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center justify-center mx-auto gap-1">
                      <Eye size={14} /> Xem
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalarySummary;