import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Alert } from 'antd';
import { FilterOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const SalaryFilter = ({
  listPhongBan, listChucVu, filteredNhanVien,
  selectedPhong, setSelectedPhong,
  selectedChucVu, setSelectedChucVu,
  targetMaNV, setTargetMaNV,
  selectedMonth, setSelectedMonth,
  onCalculate, loading
}) => {
  return (
    <Card 
      title={<span><FilterOutlined /> Chọn đối tượng tính lương</span>} 
      style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <div style={{ marginBottom: 5, fontWeight: 500 }}>Phòng ban:</div>
          <Select 
            placeholder="Tất cả" style={{ width: '100%' }} allowClear
            value={selectedPhong} onChange={setSelectedPhong}
          >
            {listPhongBan.map(pb => <Option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</Option>)}
          </Select>
        </Col>

        <Col span={6}>
          <div style={{ marginBottom: 5, fontWeight: 500 }}>Chức vụ:</div>
          <Select 
            placeholder="Tất cả" style={{ width: '100%' }} allowClear
            value={selectedChucVu} onChange={setSelectedChucVu}
          >
            {listChucVu.map(cv => <Option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</Option>)}
          </Select>
        </Col>

        <Col span={12}>
          <div style={{ marginBottom: 5, fontWeight: 500 }}>Nhân viên cụ thể:</div>
          <Select
            showSearch
            placeholder="Chọn nhân viên (Bỏ trống = Tính cho toàn bộ)"
            style={{ width: '100%' }}
            allowClear
            value={targetMaNV}
            onChange={setTargetMaNV}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
          >
            {filteredNhanVien.map(nv => (
              <Option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                {`${nv.ten_nhan_vien} (${nv.ma_nhan_vien})`}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <div style={{ marginBottom: 5, fontWeight: 500 }}>Kỳ lương:</div>
          <DatePicker 
            picker="month" format="MM/YYYY"
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(val || dayjs())}
            style={{ width: '100%' }} allowClear={false}
          />
        </Col>

        <Col span={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button 
            type="primary" size="large" icon={<CalculatorOutlined />} 
            onClick={onCalculate} loading={loading}
            style={{ width: '100%', height: 40, fontWeight: 'bold' }}
          >
            {targetMaNV ? `Tính lương cho ${targetMaNV}` : 'Payroll'}
          </Button>
        </Col>
      </Row>

    </Card>
  );
};

export default SalaryFilter;