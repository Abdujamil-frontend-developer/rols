import React from "react";
import { Form, Button, message } from "antd";
import { LoginStyled } from "./style";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { useAppStore } from "@/store/useAppStore";
import { Spin } from "antd";
import { routes } from "@/constants/routes";

interface LoginForm {
  login: string;
  password: string;
  remember?: boolean;
}

const LoginPage: React.FC = () => {
    const { login, isAuthLoading, authError } = useAppStore();
    const navigate = useNavigate();

    const handleFinish = async (values: LoginForm) => {
        const success = await login(values.login, values.password);
        if (success) {
            message.success("Muvaffaqiyatli kirildi!");
            navigate(routes.HOME);
        }
    };

  return (
    <LoginStyled>
      <div className="login">
        <h2>Kirish</h2>

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item name="login" rules={[{ required: true, message: "Loginni kiriting" }]}>
            <Input size="large" placeholder="Login" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Parolni kiriting" }]}>
            <Input.Password size="large" placeholder="Parol" />
          </Form.Item>

          {authError && (
            <div style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>
              {authError}
            </div>
          )}

          <Button
            htmlType="submit"
            size="large"
            block
            className="login__btn"
            disabled={isAuthLoading}
          >
            {isAuthLoading ? <Spin size="small" /> : 'Kirish'}
          </Button>
        </Form>
      </div>
    </LoginStyled>
  );
};

export default LoginPage;
