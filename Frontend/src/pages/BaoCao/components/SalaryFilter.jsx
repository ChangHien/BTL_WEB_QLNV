import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const SalaryFilter = ({ 
  listPhongBan, listChucVu, filteredNhanVien, 
  selectedPhong, setSelectedPhong,
  selectedChucVu, setSelectedChucVu,
  targetMaNV, setTargetMaNV,
  year, setYear,
  onSearch, loading 
}) => {
  return (
    <Card style={{ marginBottom: 24, borderTop: '3px solid #1890ff', background: '#f9f9f9' }}>
      <div style={{ marginBottom: 16, fontWeight: 'bold', color: '#1890ff' }}>
        <FilterOutlined /> Bộ lọc tìm kiếm:
      </div>
      
      <Row gutter={16}>
        <Col span={6}>
          <div style={{marginBottom: 5, fontSize: 12}}>Phòng ban:</div>
          <Select 
            placeholder="Tất cả" style={{ width: '100%' }} allowClear
            value={selectedPhong} onChange={setSelectedPhong}
          >
            {listPhongBan.map(pb => <Option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</Option>)}
          </Select>
        </Col>

        <Col span={6}>
          <div style={{marginBottom: 5, fontSize: 12}}>Chức vụ:</div>
          <Select 
            placeholder="Tất cả" style={{ width: '100%' }} allowClear
            value={selectedChucVu} onChange={setSelectedChucVu}
          >
            {listChucVu.map(cv => <Option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</Option>)}
          </Select>
        </Col>

        <Col span={8}>
          <div style={{marginBottom: 5, fontSize: 12}}>Nhân viên:</div>
          <Select
            showSearch
            placeholder="Tất cả nhân viên trong bộ lọc..."
            style={{ width: '100%' }}
            allowClear
            optionFilterProp="children"
            value={targetMaNV}
            onChange={setTargetMaNV}
            filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
          >
            {filteredNhanVien.map(nv => (
              <Option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                {`${nv.ten_nhan_vien} (${nv.ma_nhan_vien})`}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={4} style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <div style={{flex:1}}>
            <div style={{marginBottom: 5, fontSize: 12}}>Năm:</div>
            <DatePicker 
              picker="year" style={{ width: '100%' }} allowClear={false} 
              defaultValue={dayjs()} value={year ? dayjs().year(year) : null}
              onChange={(d) => setYear(d ? d.year() : 2025)} 
            />
          </div>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch} loading={loading}>
            Xem
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default SalaryFilter;