import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Select,
  DatePicker,
  TimePicker,
  Button,
  message,
  Row,
  Col,
} from "antd";
import chamCongApi from "../../api/chamCongApi";
import nhanVienApi from "../../api/nhanVienApi";
import dayjs from "dayjs";
import "./ChamCongPage.scss";

const { Option } = Select;

const ChamCongPage = () => {
  const [listChamCong, setListChamCong] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
  const [form, setForm] = useState({
    ma_nhan_vien: undefined,
    ngay_lam: dayjs(),
    gio_vao: null,
    gio_ra: null,
  });
  const [loading, setLoading] = useState(false);

  // Tồn tại: chọn tháng/năm để gọi API lịch sử
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // 1..12
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // Load danh sách nhân viên (FE vẫn cần để chọn)
  const loadNhanVien = async () => {
    try {
      const nvRes = await nhanVienApi.getAll();
      setNhanVienList(nvRes);
    } catch (err) {
      message.error("Lỗi tải danh sách nhân viên");
    }
  };

  useEffect(() => {
    loadNhanVien();
  }, []);

  // Lấy lịch sử cho nhân viên đã chọn + tháng/năm
  const loadHistory = async (ma_nv) => {
    if (!ma_nv) {
      setListChamCong([]);
      return;
    }
    setLoading(true);
    try {
      const res = await chamCongApi.getByNhanVien(ma_nv, selectedMonth, selectedYear);
      // res là mảng các bản ghi: [{ id, ma_nhan_vien, ngay_lam, gio_vao, gio_ra, trang_thai_ca }, ...]
      // Nếu bạn muốn hiển thị tên nhân viên, join từ nhanVienList
      const withNames = res.map((r) => {
        const nv = nhanVienList.find((n) => n.ma_nhan_vien === r.ma_nhan_vien);
        return {
          ...r,
          ten_nhan_vien: nv?.ten_nhan_vien ?? r.ma_nhan_vien,
        };
      });
      setListChamCong(withNames);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi tải lịch sử chấm công");
      setListChamCong([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi thay đổi nhân viên hoặc tháng/năm
  useEffect(() => {
    if (form.ma_nhan_vien) {
      loadHistory(form.ma_nhan_vien);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.ma_nhan_vien || !form.ngay_lam || !form.gio_vao || !form.gio_ra) {
      return message.warning("Vui lòng điền đầy đủ thông tin");
    }
    try {
      // Gọi backend POST /chamcong/full (HR/Admin). Nếu user không có quyền, backend trả lỗi 403.
      await chamCongApi.createFull({
        ma_nhan_vien: form.ma_nhan_vien,
        ngay_lam: form.ngay_lam.format("YYYY-MM-DD"),
        gio_vao: form.gio_vao.format("HH:mm:ss"),
        gio_ra: form.gio_ra.format("HH:mm:ss"),
      });
      message.success("Chấm công thành công (full).");
      // reload history nếu đang xem nhân viên này
      if (form.ma_nhan_vien) loadHistory(form.ma_nhan_vien);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi chấm công");
    }
  };

  // Quick check-in / check-out functions (nếu bạn muốn dùng)
  const handleCheckIn = async () => {
    if (!form.ma_nhan_vien) return message.warning("Chọn nhân viên để check-in");
    try {
      await chamCongApi.checkIn({
        ma_nhan_vien: form.ma_nhan_vien,
        ngay_lam: form.ngay_lam.format("YYYY-MM-DD"),
        gio_vao: form.gio_vao ? form.gio_vao.format("HH:mm:ss") : dayjs().format("HH:mm:ss"),
      });
      message.success("Check-in thành công");
      if (form.ma_nhan_vien) loadHistory(form.ma_nhan_vien);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi check-in");
    }
  };

  const handleCheckOut = async () => {
    if (!form.ma_nhan_vien) return message.warning("Chọn nhân viên để check-out");
    try {
      await chamCongApi.checkOut({
        ma_nhan_vien: form.ma_nhan_vien,
        ngay_lam: form.ngay_lam.format("YYYY-MM-DD"),
        gio_ra: form.gio_ra ? form.gio_ra.format("HH:mm:ss") : dayjs().format("HH:mm:ss"),
      });
      message.success("Check-out thành công");
      if (form.ma_nhan_vien) loadHistory(form.ma_nhan_vien);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi check-out");
    }
  };

  const columns = [
    { title: "Nhân viên", dataIndex: "ten_nhan_vien", key: "ten_nhan_vien" },
    { title: "Ngày làm", dataIndex: "ngay_lam", key: "ngay_lam" },
    { title: "Giờ vào", dataIndex: "gio_vao", key: "gio_vao" },
    { title: "Giờ ra", dataIndex: "gio_ra", key: "gio_ra" },
    { title: "Trạng thái", dataIndex: "trang_thai_ca", key: "trang_thai_ca" },
  ];

  return (
    <div className="ChamCongPage">
      <h2>📝 Quản lý Chấm Công</h2>

      <Card title="Chấm công mới / thao tác nhanh" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Select
              placeholder="Chọn nhân viên"
              style={{ width: "100%" }}
              value={form.ma_nhan_vien}
              onChange={(val) => {
                handleChange("ma_nhan_vien", val);
                // load ngay khi chọn nhân viên
                setTimeout(() => loadHistory(val), 0);
              }}
            >
              {nhanVienList.map((nv) => (
                <Option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                  {nv.ten_nhan_vien}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={4}>
            <DatePicker
              picker="month"
              value={dayjs(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`)}
              onChange={(val) => {
                if (!val) return;
                setSelectedMonth(val.month() + 1);
                setSelectedYear(val.year());
              }}
              style={{ width: "100%" }}
            />
          </Col>

          <Col span={4}>
            <DatePicker
              placeholder="Ngày làm"
              style={{ width: "100%" }}
              value={form.ngay_lam}
              onChange={(val) => handleChange("ngay_lam", val)}
            />
          </Col>

          <Col span={4}>
            <TimePicker
              placeholder="Giờ vào"
              style={{ width: "100%" }}
              value={form.gio_vao}
              onChange={(val) => handleChange("gio_vao", val)}
            />
          </Col>

          <Col span={4}>
            <TimePicker
              placeholder="Giờ ra"
              style={{ width: "100%" }}
              value={form.gio_ra}
              onChange={(val) => handleChange("gio_ra", val)}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }} gutter={12}>
          <Col>
            <Button type="primary" onClick={handleSubmit}>
              Ghi nhận (Full) {/* dùng cho HR */}
            </Button>
          </Col>

          <Col>
            <Button onClick={handleCheckIn}>Check-in</Button>
          </Col>

          <Col>
            <Button onClick={handleCheckOut}>Check-out</Button>
          </Col>
        </Row>
      </Card>

      <Card title={`Danh sách chấm công - ${selectedMonth}/${selectedYear}`}>
        <Table
          columns={columns}
          dataSource={listChamCong}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ChamCongPage;
