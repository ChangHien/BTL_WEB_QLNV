import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Button, Table, Row, Col, Statistic, message, Tag, Input, Form, Divider } from 'antd';
import { SearchOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import luongApi from '../../api/luongApi';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const BaoCaoThuNhap = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [tongNam, setTongNam] = useState(0);
  const [year, setYear] = useState(dayjs().year());
  const [loading, setLoading] = useState(false);
  
  // State dành cho Admin tra cứu
  const [targetMaNV, setTargetMaNV] = useState(''); 
  const [viewingName, setViewingName] = useState(''); 

  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';

  // Hàm gọi API
  const fetchBaoCao = async (maNV_can_xem) => {
    if (!maNV_can_xem) {
        message.error("Vui lòng nhập Mã Nhân Viên!");
        return;
    }

    setLoading(true);
    try {
      console.log(`Đang lấy báo cáo cho ${maNV_can_xem} năm ${year}`);
      const res = await luongApi.getThongKeNam(maNV_can_xem, year);
      
      setData(res.data.chi_tiet_theo_thang);
      setTongNam(res.data.tong_thu_nhap_nam);
      setViewingName(maNV_can_xem); // Cập nhật người đang xem
      message.success(`Đã tải dữ liệu của ${maNV_can_xem}`);
      
    } catch (error) {
      console.error(error);
      // Nếu lỗi 404 hoặc 403
      const msg = error.response?.data?.message || 'Không tìm thấy dữ liệu lương.';
      message.warning(msg);
      setData([]);
      setTongNam(0);
      setViewingName(maNV_can_xem);
    } finally {
      setLoading(false);
    }
  };

  //1.Nếu là Staff: Tự động tải của chính mình khi vào trang
  useEffect(() => {
    if (user && !isAdminOrHR) {
        setTargetMaNV(user.ma_nhan_vien);
        fetchBaoCao(user.ma_nhan_vien);
    }
  }, [user]);

  //2.Nếu là Admin: Xử lý khi bấm nút Tìm kiếm
  const handleAdminSearch = () => {
      fetchBaoCao(targetMaNV);
  };

  const columns = [
    { 
      title: 'Tháng', dataIndex: 'thang', key: 'thang',
      render: t => <Tag color="blue">Tháng {t}</Tag> 
    },
    { 
      title: 'Lương Cơ Bản', dataIndex: 'luong_co_ban', key: 'lcb', 
      render: v => Number(v).toLocaleString() 
    },
    { 
      title: 'Làm Thêm (OT)', dataIndex: 'luong_them_gio', key: 'ot', 
      render: v => Number(v).toLocaleString() 
    },
    { 
      title: 'Thực Nhận', dataIndex: 'tong_luong', key: 'total', 
      render: v => <b style={{ color: '#389e0d', fontSize: 16 }}>{Number(v).toLocaleString()}</b> 
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>
        {isAdminOrHR ? "🔍 Tra Cứu Thu Nhập Nhân Viên" : "📊 Báo Cáo Thu Nhập Cá Nhân"}
      </h2>
      
      {/* THANH CÔNG CỤ TÌM KIẾM (Chỉ hiện cho Admin/HR) */}
      {isAdminOrHR && (
        <Card style={{ marginBottom: 24, borderTop: '3px solid #1890ff' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
                <div>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>Nhập Mã Nhân Viên:</div>
                    <Input 
                        prefix={<UserOutlined />} 
                        placeholder="VD: NV003" 
                        value={targetMaNV}
                        onChange={(e) => setTargetMaNV(e.target.value)}
                        style={{ width: 200 }}
                        onPressEnter={handleAdminSearch}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>Chọn Năm:</div>
                    <DatePicker 
                        picker="year" 
                        defaultValue={dayjs()}
                        onChange={(d) => setYear(d ? d.year() : 2025)} 
                        style={{ width: 120 }}
                        allowClear={false}
                    />
                </div>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleAdminSearch} loading={loading}>
                    Tra Cứu
                </Button>
            </div>
        </Card>
      )}

      {/* HIỂN THỊ KẾT QUẢ (Chỉ hiện khi đã có người được chọn xem) */}
      {(viewingName || !isAdminOrHR) && (
          <Row gutter={16}>
            <Col span={16}>
              <div style={{ marginBottom: 16, fontWeight: 'bold', fontSize: 16 }}>
                Dữ liệu lương của: <Tag color="geekblue" style={{ fontSize: 14, padding: '4px 10px' }}>{viewingName || targetMaNV}</Tag>
                - Năm {year}
              </div>
              <Table 
                columns={columns} 
                dataSource={data} 
                rowKey="thang" 
                pagination={false} 
                bordered
                loading={loading}
                locale={{ emptyText: 'Chưa có dữ liệu lương tháng nào' }}
              />
            </Col>
            
            <Col span={8}>
              <Card style={{ background: '#f6ffed', borderColor: '#b7eb8f', textAlign: 'center', position: 'sticky', top: 20 }}>
                <Statistic 
                  title={`TỔNG THU NHẬP NĂM ${year}`} 
                  value={tongNam} 
                  precision={0} 
                  suffix="VNĐ" 
                  valueStyle={{ color: '#389e0d', fontWeight: 'bold', fontSize: 28 }}
                  prefix={<DollarOutlined />}
                />
                <Divider />
                <div style={{ color: '#888' }}>Nhân viên: {viewingName}</div>
              </Card>
            </Col>
          </Row>
      )}
    </div>
  );
};

export default BaoCaoThuNhap;