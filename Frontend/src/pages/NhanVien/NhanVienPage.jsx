import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Spin, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';
import NhanVienFilter from './components/NhanVienFilter';
import NhanVienFormModal from './components/NhanVienFormModal';

const NhanVienPage = () => {
  const [loading, setLoading] = useState(false);
  const [listNhanVien, setListNhanVien] = useState([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);
  const [selectedPhong, setSelectedPhong] = useState(undefined);
  const [selectedChucVu, setSelectedChucVu] = useState(undefined);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingNhanVien, setEditingNhanVien] = useState(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [nvRes, pbRes, cvRes] = await Promise.all([
        nhanVienApi.getAll(),
        phongBanApi.getAll(),
        chucVuApi.getAll()
      ]);
      setListNhanVien(Array.isArray(nvRes) ? nvRes : []);
      setFilteredNhanVien(Array.isArray(nvRes) ? nvRes : []);
      const pbData = pbRes?.data || pbRes || [];
      const cvData = cvRes?.data || cvRes || [];
      setListPhongBan(Array.isArray(pbData) ? pbData : []);
      setListChucVu(Array.isArray(cvData) ? cvData : []);
    } catch (error) {
      message.error("Lỗi tải dữ liệu");
      setListPhongBan([]);
      setListChucVu([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    setFilteredNhanVien(result);
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  // Table columns
  const columns = [
    { title: 'Mã NV', dataIndex: 'ma_nhan_vien', key: 'ma_nhan_vien' },
    { title: 'Tên NV', dataIndex: 'ten_nhan_vien', key: 'ten_nhan_vien' },
    { title: 'Phòng Ban', dataIndex: 'ma_phong', key: 'ma_phong' },
    { title: 'Chức Vụ', dataIndex: 'ma_chuc_vu', key: 'ma_chuc_vu' },
    { title: 'Mức Lương', dataIndex: 'muc_luong_co_ban', key: 'muc_luong_co_ban', render: (val) => Number(val).toLocaleString('vi-VN') + ' VNĐ' },
    { title: 'Ngày Vào Làm', dataIndex: 'ngay_vao_lam', key: 'ngay_vao_lam' },
    { title: 'Trạng Thái', dataIndex: 'trang_thai', key: 'trang_thai' },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={() => openEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.ma_nhan_vien)} />
        </>
      )
    }
  ];

  // Modal handlers
  const openEditModal = (nv) => {
    setEditingNhanVien(nv || null);
    setModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      if (editingNhanVien) {
        await nhanVienApi.update(editingNhanVien.ma_nhan_vien, values);
        message.success("Cập nhật nhân viên thành công");
      } else {
        await nhanVienApi.create(values);
        message.success("Thêm nhân viên thành công");
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi lưu nhân viên");
    }
  };

  const handleDelete = (maNV) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa nhân viên ${maNV}?`,
      onOk: async () => {
        try {
          await nhanVienApi.delete(maNV);
          message.success("Xóa thành công");
          loadData();
        } catch (error) {
          message.error("Xóa thất bại");
        }
      }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>👤 Quản Lý Nhân Viên</h2>

      <Card style={{ marginBottom: 24 }}>
        <NhanVienFilter
          listPhongBan={listPhongBan}
          listChucVu={listChucVu}
          selectedPhong={selectedPhong}
          selectedChucVu={selectedChucVu}
          setSelectedPhong={setSelectedPhong}
          setSelectedChucVu={setSelectedChucVu}
          onAdd={() => openEditModal(null)}
        />
      </Card>

      <Card>
        <Table columns={columns} dataSource={filteredNhanVien} rowKey="ma_nhan_vien" />
      </Card>

      <NhanVienFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        editingNhanVien={editingNhanVien}
        listPhongBan={listPhongBan}
        listChucVu={listChucVu}
      />
    </div>
  );
};

export default NhanVienPage;
