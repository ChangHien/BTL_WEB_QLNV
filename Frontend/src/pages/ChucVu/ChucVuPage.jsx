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

  //1. LẤY DỮ LIỆU TỪ API
  const fetchChucVu = async () => {
    setLoading(true);
    try {
      const res = await chucVuApi.getAll();
      
      const listData = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setData(listData);
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải danh sách chức vụ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChucVu();
  }, []);

  //2. XỬ LÝ LƯU (THÊM / SỬA) 
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

     
      const payload = {
        ...values,
        ma_chuc_vu: values.ma_chuc_vu.trim().toUpperCase()
      };

      if (editingRecord) {
        await chucVuApi.update(editingRecord.ma_chuc_vu, payload);
        message.success('Cập nhật chức vụ thành công!');
      } else {
        await chucVuApi.create(payload);
        message.success('Thêm chức vụ mới thành công!');
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      fetchChucVu(); 

    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data?.error || 'Lỗi lưu dữ liệu';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  //3. XỬ LÝ XÓA
  const handleDelete = async (id) => {
    try {
      await chucVuApi.delete(id);
      message.success('Xóa thành công!');
      fetchChucVu();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Không thể xóa (Có thể đang được sử dụng)';
      message.error(errMsg);
    }
  };


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

  const columns = [
    {
      title: 'Mã Chức Vụ',
      dataIndex: 'ma_chuc_vu',
      key: 'ma_chuc_vu',
      width: '20%',
      fontWeight: 'bold',
      render: text => <Tag color="purple">{text}</Tag>
    },
    {
      title: 'Tên Chức Vụ',
      dataIndex: 'ten_chuc_vu',
      key: 'ten_chuc_vu',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => openEditModal(record)} />
          <Popconfirm 
            title="Bạn có chắc chắn xóa?" 
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.ma_chuc_vu)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>Thêm mới</Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="ma_chuc_vu"
        loading={loading}
        bordered
        pagination={{ pageSize: 6 }}
      />

      <Modal
        title={editingRecord ? "Sửa Chức Vụ" : "Thêm Chức Vụ Mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="form_chuc_vu">
          <Form.Item
            name="ma_chuc_vu"
            label="Mã Chức Vụ"
            rules={[
              { required: true, message: 'Vui lòng nhập mã!' }, 
              { max: 1, message: 'Mã chức vụ chỉ tối đa 1 ký tự!' },
              { pattern: /^[A-Za-z0-9]+$/, message: 'Chỉ chứa chữ hoặc số' }
            ]}
            help="Ví dụ: T (Trưởng phòng), P (Phó phòng)"
          >
            <Input 
              disabled={!!editingRecord} 
              maxLength={1} 
              placeholder="VD: T" 
              style={{ textTransform: 'uppercase'}} 
            />
          </Form.Item>
          
          <Form.Item
            name="ten_chuc_vu"
            label="Tên Chức Vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên chức vụ!' }]}
          >
            <Input placeholder="VD: Trưởng Phòng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChucVuPage;