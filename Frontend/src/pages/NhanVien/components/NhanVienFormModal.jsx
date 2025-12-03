import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const NhanVienFormModal = ({
  visible,
  onCancel,
  onOk,
  editingNhanVien,
  listPhongBan,
  listChucVu
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (editingNhanVien) form.setFieldsValue(editingNhanVien);
  }, [editingNhanVien]);

  return (
    <Modal
      title={editingNhanVien ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
      open={visible}
      onOk={async () => {
        const values = await form.validateFields();
        onOk(values);
      }}
      onCancel={onCancel}
      okText="Lưu"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="ma_nhan_vien"
          label="Mã NV"
          rules={[{ required: true, message: 'Nhập mã nhân viên!' }]}
        >
          <Input disabled={!!editingNhanVien} />
        </Form.Item>

        <Form.Item
          name="ten_nhan_vien"
          label="Tên NV"
          rules={[{ required: true, message: 'Nhập tên nhân viên!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="ma_phong" label="Phòng Ban">
          <Select allowClear>
            {listPhongBan.map(pb => (
              <Option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="ma_chuc_vu" label="Chức Vụ">
          <Select allowClear>
            {listChucVu.map(cv => (
              <Option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="muc_luong_co_ban"
          label="Mức lương"
          rules={[{ required: true, message: 'Nhập mức lương!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item name="ngay_vao_lam" label="Ngày vào làm">
          <Input type="date" />
        </Form.Item>

        <Form.Item name="trang_thai" label="Trạng Thái">
          <Select>
            <Option value="DangLam">Đang làm</Option>
            <Option value="DaNghi">Đã nghỉ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NhanVienFormModal;
