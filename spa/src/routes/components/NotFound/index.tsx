import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sahifa topilmadi."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Bosh sahifaga qaytish
        </Button>
      }
    />
  );
};

export default NotFound;
