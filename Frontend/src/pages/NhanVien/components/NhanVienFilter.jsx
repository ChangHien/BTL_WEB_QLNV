import React from 'react';
import { Row, Col, Select, Button } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const NhanVienFilter = ({
  listPhongBan,
  listChucVu,
  selectedPhong,
  selectedChucVu,
  setSelectedPhong,
  setSelectedChucVu,
  onAdd
}) => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <div style={{ fontWeight: 500, marginBottom: 5 }}>Phòng Ban</div>
        <Select
          placeholder="Tất cả"
          style={{ width: '100%' }}
          allowClear
          value={selectedPhong}
          onChange={setSelectedPhong}
        >
          {listPhongBan.map(pb => (
            <Option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</Option>
          ))}
        </Select>
      </Col>

      <Col span={6}>
        <div style={{ fontWeight: 500, marginBottom: 5 }}>Chức Vụ</div>
        <Select
          placeholder="Tất cả"
          style={{ width: '100%' }}
          allowClear
          value={selectedChucVu}
          onChange={setSelectedChucVu}
        >
          {listChucVu.map(cv => (
            <Option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</Option>
          ))}
        </Select>
      </Col>

      <Col span={12} style={{ textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm Nhân Viên
        </Button>
      </Col>
    </Row>
  );
};

export default NhanVienFilter;
