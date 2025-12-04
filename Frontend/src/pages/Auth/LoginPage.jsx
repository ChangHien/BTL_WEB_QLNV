import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Layout, Row, Col, Space } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MailOutlined, CustomerServiceOutlined } from '@ant-design/icons'; // Import thêm icon

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const BACKGROUND_URL = "https://i.pinimg.com/1200x/cd/fb/c7/cdfbc75280e35fbfd63647e2259d7910.jpg"; 
const LOGO_URL = "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"; 

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('Chào mừng quay trở lại!');
      navigate('/');
    } catch (error) {
      message.error(error.message || 'Sai thông tin đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = [
    "Câu hỏi thường gặp", "Trung tâm trợ giúp", "Điều khoản sử dụng", "Quyền riêng tư",
    "Tùy chọn cookie", "Thông tin doanh nghiệp"
  ];

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url(${BACKGROUND_URL})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      fontFamily: 'Helvetica, Arial, sans-serif'
    }}>
      
      {/*HEADER */}
      <Header style={{ 
        background: 'transparent', 
        padding: '0 4%', 
        height: 80, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* Logo + Tên */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={LOGO_URL} alt="Logo" style={{ height: 35 }} /> 
          <h1 style={{ 
            color: '#316fe2ff', 
            fontSize: 24, 
            fontWeight: 800, 
            letterSpacing: 1,
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            MANAGEMENT SYSTEM
          </h1>
        </div>

        {/*Thông tin liên hệ */}
        <Space size="large" style={{ color: '#fff', fontWeight: 500, fontSize: 13, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          <span style={{ cursor: 'pointer', opacity: 0.8, transition: '0.3s' }} className="hover-white"><MailOutlined /> ms@company.com</span>
          <span style={{ cursor: 'pointer', opacity: 0.8, transition: '0.3s' }} className="hover-white"><CustomerServiceOutlined /> Hỗ trợ</span>
        </Space>
      </Header>

      {/* CONTENT */}
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card 
          bordered={false}
          style={{ 
            width: 380, 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            borderRadius: 8,
            padding: '30px 30px',
            border: 'none'
          }}
        >
          <Title level={2} style={{ color: '#fff', marginBottom: 25, fontWeight: 700 }}>
            Đăng nhập
          </Title>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            {/* Input */}
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
              style={{ marginBottom: 16 }}
            >
              <Input 
                placeholder="Tên đăng nhập" 
                className="netflix-input" 
                style={{ height: 45 }} 
              />
            </Form.Item>

            {/*Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              style={{ marginBottom: 24 }} 
            >
              <Input.Password 
                placeholder="Mật khẩu" 
                className="netflix-input"
                style={{ height: 45 }}
              />
            </Form.Item>

            {/* Nút Đăng nhập */}
            <Form.Item style={{ marginBottom: 10 }}>
              <Button type="primary" htmlType="submit" block loading={loading} className="netflix-btn"
                style={{ marginTop: 0 }} 
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      {/* FOOTER*/}
      <Footer style={{ 
        background: 'rgba(0,0,0,0.75)', 
        color: '#737373', 
        padding: '30px 10%',
        marginTop: 40
      }}>
        <div style={{ marginBottom: 20 }}>Bạn có câu hỏi? Liên hệ với chúng tôi.</div>
        
        <Row gutter={[16, 12]}>
          {footerLinks.map((link, index) => (
            <Col span={6} key={index} xs={12} sm={8} md={6}>
              <a href="#" className="netflix-link" style={{ fontSize: 13 }}>{link}</a>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: 20, fontSize: 13 }}>
            © {new Date().getFullYear()} CÔNG TY TNHH ĐẠT A+ MÔN LẬP TRÌNH WEB
        </div>
      </Footer>
    </Layout>
  );
};

export default LoginPage;