import React, { useEffect, useState } from "react";
import { Table, Card, Select, DatePicker, TimePicker, Button, message, Row, Col } from "antd";
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
    ngay_lam: null,
    gio_vao: null,
    gio_ra: null,
  });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const chamCongRes = await chamCongApi.getAll();
      const nvRes = await nhanVienApi.getAll();
      setListChamCong(chamCongRes);
      setNhanVienList(nvRes);
    } catch (err) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.ma_nhan_vien || !form.ngay_lam || !form.gio_vao || !form.gio_ra) {
      return message.warning("Vui lòng điền đầy đủ thông tin");
    }
    try {
      await chamCongApi.create({
        ma_nhan_vien: form.ma_nhan_vien,
        ngay_lam: form.ngay_lam.format("YYYY-MM-DD"),
        gio_vao: form.gio_vao.format("HH:mm:ss"),
        gio_ra: form.gio_ra.format("HH:mm:ss"),
      });
      message.success("Chấm công thành công");
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi chấm công");
    }
  };

  const columns = [
    { title: "Nhân viên", dataIndex: "ten_nhan_vien", key: "ten_nhan_vien" },
    { title: "Ngày làm", dataIndex: "ngay_lam", key: "ngay_lam" },
    { title: "Giờ vào", dataIndex: "gio_vao", key: "gio_vao" },
    { title: "Giờ ra", dataIndex: "gio_ra", key: "gio_ra" },
  ];

  return (
    <div className="ChamCongPage">
      <h2>📝 Quản lý Chấm Công</h2>

      <Card title="Chấm công mới" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Select
              placeholder="Chọn nhân viên"
              style={{ width: "100%" }}
              value={form.ma_nhan_vien}
              onChange={(val) => handleChange("ma_nhan_vien", val)}
            >
              {nhanVienList.map((nv) => (
                <Option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                  {nv.ten_nhan_vien}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="Ngày làm"
              style={{ width: "100%" }}
              value={form.ngay_lam}
              onChange={(val) => handleChange("ngay_lam", val)}
            />
          </Col>
          <Col span={6}>
            <TimePicker
              placeholder="Giờ vào"
              style={{ width: "100%" }}
              value={form.gio_vao}
              onChange={(val) => handleChange("gio_vao", val)}
            />
          </Col>
          <Col span={6}>
            <TimePicker
              placeholder="Giờ ra"
              style={{ width: "100%" }}
              value={form.gio_ra}
              onChange={(val) => handleChange("gio_ra", val)}
            />
          </Col>
        </Row>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={handleSubmit}
        >
          Chấm công
        </Button>
      </Card>

      <Card title="Danh sách chấm công">
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
