import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, BankOutlined } from '@ant-design/icons';
import phongBanApi from '../../api/phongBanApi';

const { Option } = Select;

const PhongBanPage = () => {
  // 1. KHAI BÁO STATE
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  //2. HÀM GỌI API LẤY DỮ LIỆU 
  const fetchPhongBan = async () => {
    setLoading(true);
    try {
      const res = await phongBanApi.getAll();
      
      setData(Array.isArray(res.data) ? res.data : []); 
    } catch (error) {
      message.error('Lỗi tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhongBan();
  }, []);
//3. XỬ LÝ SỰ KIỆN LƯU (THÊM HOẶC SỬA) 
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        await phongBanApi.update(editingRecord.ma_phong, values);
        message.success('Cập nhật thành công!');
      } else {
        await phongBanApi.create(values);
        message.success('Thêm mới thành công!');
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      fetchPhongBan();
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi lưu dữ liệu';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };
//4. XỬ LÝ SỰ KIỆN XÓA 
  const handleDelete = async (ma_phong) => {
    try {
      await phongBanApi.delete(ma_phong);
      message.success('Xóa thành công!');
      fetchPhongBan();
    } catch (error) {
      message.error(error.response?.data?.message || 'Xóa thất bại');
    }
  };

 //5. CÁC HÀM TIỆN ÍCH CHO MODAL
  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };
//6. CẤU HÌNH CỘT CHO BẢNG 
  const columns = [
    { title: 'Mã', dataIndex: 'ma_phong', width: '10%', fontWeight: 'bold' },
    { title: 'Tên Phòng Ban', dataIndex: 'ten_phong', width: '30%' },
    { title: 'Năm TL', dataIndex: 'nam_thanh_lap', width: '15%', align: 'center' },
    { 
      title: 'Trạng Thái', dataIndex: 'trang_thai', width: '15%', align: 'center',
      render: t => <Tag color={t === 'HoatDong' ? 'green' : 'red'}>{t === 'HoatDong' ? 'Hoạt động' : 'Ngừng'}</Tag>
    },
    {
      title: 'Hành động', key: 'action', align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openEditModal(record)} />
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.ma_phong)}>
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];
//7. GIAO DIỆN HIỂN THỊ 
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2><BankOutlined /> Quản Lý Phòng Ban</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchPhongBan}>Làm mới</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>Thêm mới</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="ma_phong" loading={loading} bordered />
      <Modal title={editingRecord ? "Sửa" : "Thêm"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item name="ma_phong" label="Mã Phòng" rules={[{ required: true, message: 'Nhập mã!' }, { len: 3, message: 'Mã phải đúng 3 ký tự!' }]}>
            <Input disabled={!!editingRecord} maxLength={3} style={{ textTransform: 'uppercase'}} />
          </Form.Item>
          <Form.Item name="ten_phong" label="Tên Phòng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="nam_thanh_lap" label="Năm TL" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="trang_thai" label="Trạng Thái" style={{ flex: 1 }} initialValue="HoatDong">
              <Select><Option value="HoatDong">Hoạt động</Option><Option value="NgungHoatDong">Ngừng</Option></Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PhongBanPage;