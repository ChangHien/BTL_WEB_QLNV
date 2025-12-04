import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import chucVuApi from '../../api/chucVuApi';

const ChucVuPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchChucVu = async () => {
    setLoading(true);
    try {
      const res = await chucVuApi.getAll();
      setData(Array.isArray(res) ? res : []);
    } catch (error) {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChucVu(); }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Gửi đúng tên cột ma_chuc_vu
      const payload = {
        ma_chuc_vu: values.ma_chuc_vu.trim().toUpperCase(),
        ten_chuc_vu: values.ten_chuc_vu
      };

      if (editingRecord) {
        await chucVuApi.update(editingRecord.ma_chuc_vu, payload);
        message.success('Cập nhật thành công!');
      } else {
        await chucVuApi.create(payload);
        message.success('Thêm mới thành công!');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      fetchChucVu();
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi lưu dữ liệu';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await chucVuApi.delete(id);
      message.success('Xóa thành công!');
      fetchChucVu();
    } catch (error) {
      message.error('Không thể xóa chức vụ này');
    }
  };

  const columns = [
    { title: 'Mã', dataIndex: 'ma_chuc_vu', key: 'ma', width: '20%', fontWeight: 'bold', render: t => <Tag color="purple">{t}</Tag> },
    { title: 'Tên Chức Vụ', dataIndex: 'ten_chuc_vu', key: 'ten' },
    { title: 'Hành động', key: 'action', align: 'center', width: '20%',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => { setEditingRecord(record); form.setFieldsValue(record); setIsModalOpen(true); }} />
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.ma_chuc_vu)}><Button icon={<DeleteOutlined />} type="link" danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2><UserOutlined /> Quản Lý Chức Vụ</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchChucVu}>Làm mới</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingRecord(null); form.resetFields(); setIsModalOpen(true); }}>Thêm mới</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="ma_chuc_vu" loading={loading} bordered />
      <Modal title={editingRecord ? "Sửa" : "Thêm"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item name="ma_chuc_vu" label="Mã Chức Vụ" rules={[{ required: true }, { max: 1 }]}>
            <Input disabled={!!editingRecord} maxLength={1} style={{ textTransform: 'uppercase'}} />
          </Form.Item>
          <Form.Item name="ten_chuc_vu" label="Tên Chức Vụ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChucVuPage;