import React, { useState } from "react";
import { Layout, Button, Typography, Space } from "antd";
import { ContentContainer } from "./style";
import Sidebar from "../Sidebar";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";
import { routes } from "@/constants/routes";
import { 
  LogoutOutlined,
} from "@ant-design/icons";
import "@/styles/index.css";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

interface LayoutProps { 
  children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(routes.AUTH);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <Layout style={{ background: "#fff" }}>
        <Header className="header">
          <Space>
            <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
          </Space>
          <Space>
            <Text>{user?.username} ({user?.role})</Text>
            <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
          </Space>
        </Header>
        
        <Content style={{ background: "#fff", minHeight: 280 }}>
           <ContentContainer>{children}</ContentContainer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;