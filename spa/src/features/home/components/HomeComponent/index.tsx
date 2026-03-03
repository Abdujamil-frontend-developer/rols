import React from 'react';
import { Card, Typography, Space, Tag, Alert } from 'antd';
import {
  HomeOutlined, ShoppingOutlined, SettingOutlined,
  AppstoreOutlined, CheckCircleOutlined, LockOutlined
} from '@ant-design/icons';
import { useAppStore } from '@/store/useAppStore';
import { Permissions } from '@/constants/permissions';

const { Title, Text } = Typography;

interface PageGuide {
  icon: React.ReactNode;
  title: string;
  color: string;
  canDo: { label: string; allowed: boolean }[];
}

export const HomeComponent: React.FC = () => {
  const { user } = useAppStore();
  const isAdmin = user?.role === 'admin';
  const perms = user?.permissions || [];
  const has = (p: string) => isAdmin || perms.includes(p);

  const pages: PageGuide[] = [
    {
      icon: <HomeOutlined />, title: 'Home Page', color: '#1677ff',
      canDo: [
        { label: 'Tizimga kirish', allowed: true },
        { label: "Profilni ko'rish", allowed: true },
      ],
    },
    {
      icon: <ShoppingOutlined />, title: 'Products', color: '#fa8c16',
      canDo: [
        { label: "Mahsulotlarni ko'rish", allowed: has(Permissions.READ_PRODUCT) },
        { label: 'Mahsulot yaratish', allowed: has(Permissions.WRITE_PRODUCT) },
        { label: "Mahsulot o'chirish", allowed: has(Permissions.DELETE_PRODUCT) },
      ],
    },
    {
      icon: <AppstoreOutlined />, title: 'Page 1', color: '#52c41a',
      canDo: [
        { label: 'Sahifaga kirish', allowed: has(Permissions.PAGE1_ACCESS) },
        { label: 'Tab 1', allowed: has(Permissions.PAGE1_TAB1) },
        { label: 'Tab 2', allowed: has(Permissions.PAGE1_TAB2) },
        { label: 'Tab 3', allowed: has(Permissions.PAGE1_TAB3) },
      ],
    },
    {
      icon: <AppstoreOutlined />, title: 'Page 2', color: '#722ed1',
      canDo: [
        { label: 'Sahifaga kirish', allowed: has(Permissions.PAGE2_ACCESS) },
        { label: 'Tab 1', allowed: has(Permissions.PAGE2_TAB1) },
        { label: 'Tab 2', allowed: has(Permissions.PAGE2_TAB2) },
        { label: 'Tab 3', allowed: has(Permissions.PAGE2_TAB3) },
      ],
    },
    ...(isAdmin ? [{
      icon: <SettingOutlined />, title: 'Admin', color: '#cf1322',
      canDo: [
        { label: 'Ruxsat profillari yaratish', allowed: true },
        { label: 'User yaratish', allowed: true },
        { label: 'Userlarni tahrirlash', allowed: true },
        { label: "Userlarni o'chirish", allowed: true },
      ],
    }] : []),
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <Space align="start">
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, flexShrink: 0
          }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Xush kelibsiz, {user?.username}!</Title>
            <Space size="small" style={{ marginTop: 4 }}>
              <Tag color={isAdmin ? 'red' : 'blue'}>{isAdmin ? 'Admin' : 'User'}</Tag>
              <Text type="secondary">{perms.length} ta ruxsat berilgan</Text>
            </Space>
          </div>
        </Space>
      </Card>

      {!isAdmin && perms.length === 0 && (
        <Alert
          type="info"
          icon={<LockOutlined />}
          showIcon
          message="Hali sizga hech qanday ruxsat berilmagan"
          description="Admin sahifalarga kirish ruxsatini berishi kerak."
          style={{ marginBottom: 24 }}
        />
      )}

      <Title level={5} style={{ marginBottom: 16, color: '#666' }}>
        Sahifalar bo'yicha imkoniyatlaringiz:
      </Title>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {pages.map(page => (
          <Card
            key={page.title}
            size="small"
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            title={
              <Space>
                <span style={{ color: page.color }}>{page.icon}</span>
                <Text strong>{page.title}</Text>
              </Space>
            }
          >
            <Space wrap>
              {page.canDo.map(item => (
                <Tag
                  key={item.label}
                  color={item.allowed ? 'success' : 'default'}
                  icon={item.allowed ? <CheckCircleOutlined /> : <LockOutlined />}
                  style={{ opacity: item.allowed ? 1 : 0.5 }}
                >
                  {item.label}
                </Tag>
              ))}
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
};
