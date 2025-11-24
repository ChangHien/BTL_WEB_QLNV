import React, { useState, useEffect } from 'react';
import { 
  Card, Form, Button, DatePicker, TimePicker, 
  Table, message, Tag, Row, Col, Statistic 
} from 'antd';
import { ScheduleOutlined, HistoryOutlined, SaveOutlined } from '@ant-design/icons';
import chamCongApi from '../../api/chamCongApi';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const ChamCongPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [form] = Form.useForm();

  // 1. HÀM LẤY LỊCH SỬ
  const fetchLichSu = async () => {
    setLoading(true);
    try {
      const thang = selectedMonth.month() + 1;
      const nam = selectedMonth.year();
      
      // Gọi API lấy lịch sử của chính mình
      const res = await chamCongApi.getLichSu(user.ma_nhan_vien, thang, nam);
      
      setData(res.data.data);
    } catch (error) {
      // Nếu 404 (không có dữ liệu) thì set mảng rỗng, không cần báo lỗi
      if (error.response && error.response.status === 404) {
        setData([]);
      } else {
        message.error('Lỗi tải lịch sử chấm công');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLichSu();
  }, [user, selectedMonth]);

  // 2. HÀM GHI NHẬN CÔNG
  const onFinish = async (values) => {
    try {
      const payload = {
        ma_nhan_vien: user.ma_nhan_vien,
        ngay_lam: values.ngay_lam.format('YYYY-MM-DD'),
        gio_vao: values.ca_lam[0].format('HH:mm:ss'),
        gio_ra: values.ca_lam[1].format('HH:mm:ss'),
      };

      await chamCongApi.ghiNhan(payload);
      message.success('Ghi nhận chấm công thành công!');
      form.resetFields();
      fetchLichSu(); // Tải lại bảng sau khi thêm
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi ghi nhận công');
    }
  };

  const columns = [
    { 
      title: 'Ngày làm', 
      dataIndex: 'ngay_lam', 
      key: 'ngay',
      render: t => dayjs(t).format('DD/MM/YYYY')
    },
    { 
      title: 'Giờ vào', 
      dataIndex: 'gio_vao', 
      key: 'vao',
      render: t => <Tag color="blue">{t}</Tag>
    },
    { 
      title: 'Giờ ra', 
      dataIndex: 'gio_ra', 
      key: 'ra',
      render: t => <Tag color="orange">{t}</Tag>
    },
    {
        title: 'Thời lượng',
        key: 'duration',
        render: (_, record) => {
            // Tính sơ bộ thời gian làm
            const start = dayjs(`2000-01-01 ${record.gio_vao}`);
            const end = dayjs(`2000-01-01 ${record.gio_ra}`);
            const diff = end.diff(start, 'hour', true); // float
            return <b>{diff.toFixed(2)} giờ</b>
        }
    }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2><ScheduleOutlined /> Quản Lý Chấm Công</h2>

      <Row gutter={24}>
        {/* CỘT TRÁI: Form Ghi Nhận */}
        <Col span={10}>
          <Card title="Khai báo ca làm việc" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Form.Item 
                label="Ngày làm việc" 
                name="ngay_lam" 
                rules={[{ required: true, message: 'Chọn ngày!' }]}
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item 
                label="Ca làm (Giờ vào - Giờ ra)" 
                name="ca_lam" 
                rules={[{ required: true, message: 'Chọn giờ!' }]}
              >
                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>

              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
                Ghi Nhận
              </Button>
            </Form>
          </Card>
          
          <Card style={{ marginTop: 16, textAlign: 'center' }}>
            <Statistic title="Số ngày công tháng này" value={data.length} suffix="ngày" />
          </Card>
        </Col>

        {/* CỘT PHẢI: Lịch sử */}
        <Col span={14}>
          <Card 
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><HistoryOutlined /> Lịch sử chấm công</span>
                    <DatePicker 
                        picker="month" 
                        value={selectedMonth} 
                        onChange={setSelectedMonth} 
                        format="MM/YYYY"
                        allowClear={false}
                    />
                </div>
            }
          >
            <Table 
              columns={columns} 
              dataSource={data} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
              loading={loading}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChamCongPage;