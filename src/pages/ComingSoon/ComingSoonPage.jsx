import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToolOutlined } from '@ant-design/icons';

const ComingSoonPage = ({ title = "Tính năng đang phát triển" }) => {
  const navigate = useNavigate();

  return (
    <Result
      icon={<ToolOutlined style={{ color: '#1890ff' }} />}
      title={title}
      subTitle="Chức năng này đang được xây dựng và sẽ sớm ra mắt trong phiên bản tới."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Quay về Trang chủ
        </Button>
      }
    />
  );
};

export default ComingSoonPage;