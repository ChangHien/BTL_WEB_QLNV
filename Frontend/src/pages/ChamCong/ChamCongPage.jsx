import React, { useState, useEffect } from 'react';
import chamCongApi from '../../api/chamCongApi';

const ChamCongPage = () => {
  const [maNV, setMaNV] = useState('');
  const [ngayLam, setNgayLam] = useState('');
  const [gioVao, setGioVao] = useState('');
  const [gioRa, setGioRa] = useState('');
  const [thang, setThang] = useState('');
  const [nam, setNam] = useState('');
  const [lichSu, setLichSu] = useState([]);
  const [message, setMessage] = useState('');

  // Ghi nhận công (check-in/check-out)
  const handleGhiNhan = async () => {
    try {
      const data = { ma_nhan_vien: maNV, ngay_lam: ngayLam, gio_vao: gioVao, gio_ra: gioRa };
      const res = await chamCongApi.ghiNhan(data);
      setMessage(res.data.message || 'Ghi nhận thành công');
      fetchLichSu(); // cập nhật lịch sử ngay sau khi ghi nhận
    } catch (error) {
      setMessage(error.response?.data?.message || 'Lỗi khi ghi nhận công');
    }
  };

  // Lấy lịch sử chấm công
  const fetchLichSu = async () => {
    if (!maNV || !thang || !nam) return;
    try {
      const res = await chamCongApi.getLichSu(maNV, thang, nam);
      setLichSu(res.data.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Lỗi khi lấy lịch sử');
    }
  };

  return (
    <div className="cham-cong-page">
      <h2>Chấm công</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div className="form-ghi-nhan">
        <input
          type="text"
          placeholder="Mã nhân viên"
          value={maNV}
          onChange={(e) => setMaNV(e.target.value)}
        />
        <input
          type="date"
          placeholder="Ngày làm"
          value={ngayLam}
          onChange={(e) => setNgayLam(e.target.value)}
        />
        <input
          type="time"
          placeholder="Giờ vào"
          value={gioVao}
          onChange={(e) => setGioVao(e.target.value)}
        />
        <input
          type="time"
          placeholder="Giờ ra"
          value={gioRa}
          onChange={(e) => setGioRa(e.target.value)}
        />
        <button onClick={handleGhiNhan}>Ghi nhận</button>
      </div>

      <div className="form-lich-su">
        <h3>Lịch sử chấm công</h3>
        <input
          type="month"
          value={thang && nam ? `${nam}-${thang.padStart(2, '0')}` : ''}
          onChange={(e) => {
            const [y, m] = e.target.value.split('-');
            setNam(y);
            setThang(m);
          }}
        />
        <button onClick={fetchLichSu}>Lấy lịch sử</button>

        <table border="1" style={{ marginTop: '10px', width: '100%' }}>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Giờ vào</th>
              <th>Giờ ra</th>
            </tr>
          </thead>
          <tbody>
            {lichSu.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Chưa có dữ liệu</td>
              </tr>
            ) : (
              lichSu.map((item) => (
                <tr key={item.ngay_lam}>
                  <td>{item.ngay_lam}</td>
                  <td>{item.gio_vao}</td>
                  <td>{item.gio_ra}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChamCongPage;
