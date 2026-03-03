import React from 'react';
import { Tabs, Empty, Typography, Tag, Alert } from 'antd';
import type { TabsProps } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/useAppStore';
import { Permissions } from '@/constants/permissions';

const { Title, Text } = Typography;

export const Page2Component: React.FC = () => {
  const { user } = useAppStore();
  const isAdmin = user?.role === 'admin';
  const perms = user?.permissions || [];
  const has = (p: string) => isAdmin || perms.includes(p);

  if (!has(Permissions.PAGE2_ACCESS)) {
    return (
      <div style={{ padding: 32 }}>
        <Alert
          type="warning"
          showIcon
          icon={<LockOutlined />}
          message="Ruxsat yo'q"
          description="Bu sahifaga kirish uchun admindan 'Page2 kirish' ruxsatini so'rang."
        />
      </div>
    );
  }

  const allTabs = [
    { key: Permissions.PAGE2_TAB1, label: 'Tab 1', num: 1 },
    { key: Permissions.PAGE2_TAB2, label: 'Tab 2', num: 2 },
    { key: Permissions.PAGE2_TAB3, label: 'Tab 3', num: 3 },
    { key: Permissions.PAGE2_TAB4, label: 'Tab 4', num: 4 },
    { key: Permissions.PAGE2_TAB5, label: 'Tab 5', num: 5 },
  ];

  const items: TabsProps['items'] = allTabs
    .filter(t => has(t.key))
    .map(t => ({
      key: String(t.num),
      label: (
        <span>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
          {t.label}
        </span>
      ),
      children: (
        <div style={{ padding: 24 }}>
          <Title level={4}>Page 2 — {t.label}</Title>
          <Text type="secondary">Bu tabni ko'rish ruxsatingiz bor.</Text>
          <div style={{ marginTop: 12 }}>
            <Text>Bu yerda {t.label} kontent joylashadi.</Text>
          </div>
        </div>
      ),
    }));

  const lockedTabs = allTabs.filter(t => !has(t.key));

  return (
    <div>
      {lockedTabs.length > 0 && (
        <div style={{ padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <LockOutlined style={{ marginRight: 4 }} />
            Qulflangan tablar:{' '}
            {lockedTabs.map(t => <Tag key={t.key} style={{ fontSize: 11 }}>{t.label}</Tag>)}
          </Text>
        </div>
      )}
      {items.length === 0
        ? <Empty description="Sizda hech qanday tab ruxsati yo'q" style={{ padding: 48 }} />
        : <Tabs defaultActiveKey="1" items={items} style={{ padding: '0 8px' }} />
      }
    </div>
  );
};
