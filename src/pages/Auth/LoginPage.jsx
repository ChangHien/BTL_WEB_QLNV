import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {

      const success = await login(values.username, values.password);

      if (success) {
        message.success('Đăng nhập thành công!');
        navigate('/');
      }
    } catch (error) {
      message.error('Đăng nhập thất bại (lỗi giả lập)!');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-container">
        <Card title="Đăng nhập Hệ thống QLNV" style={{ width: 400 }}>
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập Tên đăng nhập!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
  );
};

export default LoginPage;