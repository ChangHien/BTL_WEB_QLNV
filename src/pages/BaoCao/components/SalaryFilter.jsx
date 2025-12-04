import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button } from 'antd';
import { SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const SalaryFilter = ({ 
  listPhongBan, listChucVu, filteredNhanVien, 
  selectedPhong, setSelectedPhong,
  selectedChucVu, setSelectedChucVu,
  targetMaNV, setTargetMaNV,
  year, setYear,
  selectedMonth, setSelectedMonth, 
  onSearch, onCalculate, 
  loading,
  isAdmin 
}) => {
  
  const handleClick = () => {
    if (onSearch) onSearch();
    if (onCalculate) onCalculate();
  };

  const isPayrollPage = !!onCalculate; 

  return (
    <Card style={{ marginBottom: 24, borderTop: '3px solid #1890ff', background: '#f9f9f9', borderRadius: 8 }}>
      <div style={{ marginBottom: 16, fontWeight: 'bold', color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
        {isAdmin ? <FilterOutlined /> : <CalendarOutlined />} 
        {isAdmin ? "Bộ lọc tìm kiếm quản lý:" : "Chọn thời gian xem báo cáo:"}
      </div>
      
      <Row gutter={[16, 16]}>
        
        {/* PHẦN 1: BỘ LỌC CỦA ADMIN  */}
        {isAdmin && (
          <>
            <Col span={4} xs={24} sm={12} md={4}>
              <div style={{marginBottom: 5, fontSize: 12}}>Phòng ban:</div>
              <Select 
                placeholder="Tất cả" style={{ width: '100%' }} allowClear
                value={selectedPhong} onChange={setSelectedPhong}
              >
                {listPhongBan.map(pb => <Option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</Option>)}
              </Select>
            </Col>

            <Col span={4} xs={24} sm={12} md={4}>
              <div style={{marginBottom: 5, fontSize: 12}}>Chức vụ:</div>
              <Select 
                placeholder="Tất cả" style={{ width: '100%' }} allowClear
                value={selectedChucVu} onChange={setSelectedChucVu}
              >
                {listChucVu.map(cv => <Option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</Option>)}
              </Select>
            </Col>

            <Col span={8} xs={24} sm={24} md={8}>
              <div style={{marginBottom: 5, fontSize: 12}}>Chọn Nhân viên:</div>
              <Select
                showSearch
                placeholder="Tất cả nhân viên..."
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
          </>
        )}

        {/* PHẦN 2: ACTION */}
        <Col 
            span={isAdmin ? 6 : 6} 
            xs={24} sm={12} 
            md={isAdmin ? 6 : 6} 
            style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}
        >
          <div style={{ flex: 1 }}>
            <div style={{marginBottom: 5, fontSize: 12}}>{isPayrollPage ? "Chọn Tháng:" : "Chọn Năm:"}</div>
            {isPayrollPage ? (
               <DatePicker 
                 picker="month" style={{ width: '100%' }} allowClear={false}
                 value={selectedMonth} onChange={setSelectedMonth} format="MM/YYYY"
               />
            ) : (
               <DatePicker 
                 picker="year" style={{ width: '100%' }} allowClear={false} 
                 defaultValue={dayjs()} value={year ? dayjs().year(year) : null}
                 onChange={(d) => setYear(d ? d.year() : 2025)} 
               />
            )}
          </div>

          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={handleClick} 
            loading={loading}
            style={{ minWidth: 120 }}
          >
            {isPayrollPage ? "Payroll" : "Xem Báo Cáo"}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default SalaryFilter;