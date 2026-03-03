import React from 'react';
import { Layout, Menu, message } from 'antd';
import { 
  HomeOutlined, 
  FileOutlined, 
  SettingOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@/constants/routes';
import { useAppStore } from '@/store/useAppStore';
import { Permissions } from '@/constants/permissions';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppStore();

  const isAdmin = user?.role === 'admin';
  const hasPermission = (perm: string) => isAdmin || user?.permissions?.includes(perm);

  const menuItems = [
    {
      key: routes.HOME,
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: routes.ADMIN,
      icon: <SettingOutlined />,
      label: 'Admin',
      isDisabled: !isAdmin && !hasPermission(Permissions.READ_USER),
    },
    {
      key: routes.PRODUCTS,
      icon: <AppstoreOutlined />,
      label: 'Products',
      isDisabled: false,
    },
    {
      key: routes.PAGE1,
      icon: <FileOutlined />,
      label: 'Page 1',
      isDisabled: !hasPermission(Permissions.PAGE1_ACCESS),
    },
    {
      key: routes.PAGE2,
      icon: <FileOutlined />,
      label: 'Page 2',
      isDisabled: !hasPermission(Permissions.PAGE2_ACCESS),
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    const clickedItem = menuItems.find(item => item.key === key);
    if (clickedItem?.isDisabled) {
      message.warning("Siz faqat admin ruxsat bergan joylarga kira olasiz");
      return;
    }
    navigate(key);
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      theme="light"
      width={240}
      style={{ 
        background: '#fff', 
        height: '100vh', 
        position: 'sticky', 
        top: 0, 
        left: 0,
        zIndex: 100
      }}
    >
      <div style={{ 
        height: 64, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {!collapsed && <div style={{ fontWeight: 700, fontSize: '18px', color: '#1677ff' }}>ROLS API</div>}
        <div className="sidebar-trigger" onClick={onToggle} style={{ cursor: 'pointer' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map(item => ({
          ...item,
          style: item.isDisabled ? { opacity: 0.5 } : {}
        }))}
        onClick={handleMenuClick}
        style={{ borderRight: 0, marginTop: 8 }}
      />
    </Sider>
  );
};

export default Sidebar;
