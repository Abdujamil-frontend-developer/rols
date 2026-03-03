import React from 'react';
import { Button, Input, List, Card, Typography, Space, message, Modal, Alert, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/useAppStore';
import type { Todo } from '@/store/useAppStore';
import { Permissions } from '@/constants/permissions';
import { useState, useEffect } from 'react';

const { Text, Title } = Typography;

export const ProductsComponent: React.FC = () => {
  const { todos, fetchTodos, addTodo, deleteTodo, updateTodo, isTodoLoading, user } = useAppStore();
  const isAdmin = user?.role === 'admin';
  const perms = user?.permissions || [];
  const canRead = isAdmin || perms.includes(Permissions.READ_PRODUCT);
  const canWrite = isAdmin || perms.includes(Permissions.WRITE_PRODUCT);
  const canDelete = isAdmin || perms.includes(Permissions.DELETE_PRODUCT);

  const [newProduct, setNewProduct] = useState({ title: '', short_description: '', description: '' });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => { fetchTodos(); }, []);

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.short_description) {
      message.error("Iltimos barcha kerakli maydonlarni to'ldiring");
      return;
    }
    await addTodo(newProduct);
    setNewProduct({ title: '', short_description: '', description: '' });
    message.success('Mahsulot muvaffaqiyatli qoshildi!');
  };

  const handleUpdateProduct = async () => {
    if (editingTodo) {
      await updateTodo(editingTodo);
      setEditModalVisible(false);
      setEditingTodo(null);
      message.success('Mahsulot yangilandi!');
    }
  };

  const handleDeleteProduct = async (id: number) => 
    {
    await deleteTodo(id);
    message.success("Mahsulot o'chirildi");
  };

  if (!canRead) {
    return (
      <div style={{ padding: 32 }}>
        <Alert
          type="warning"
          icon={<LockOutlined />} 
          showIcon
          message="Ruxsat yo'q"
          description="Mahsulotlarni ko'rish uchun admindan 'Mahsulot ko'rish' ruxsatini so'rang."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Mahsulotlar</Title>
        <Space>
          <Tag color={canWrite ? 'success' : 'default'} icon={canWrite ? undefined : <LockOutlined />}>Yaratish</Tag>
          <Tag color={canDelete ? 'success' : 'default'} icon={canDelete ? undefined : <LockOutlined />}>O'chirish</Tag>
        </Space>
      </div>

      {!canWrite && (
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          message="Mahsulot yaratish ruxsati yo'q"
          style={{ marginBottom: 16 }}
          banner
        />
      )}

      {canWrite && (
        <Card title="Yangi Mahsulot" style={{ marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder="Mahsulot nomi" value={newProduct.title}
              onChange={(e) => setNewProduct(p => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Qisqacha ta'rifi" value={newProduct.short_description}
              onChange={(e) => setNewProduct(p => ({ ...p, short_description: e.target.value }))} />
            <Input.TextArea placeholder="To'liq ta'rifi" value={newProduct.description}
              onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))} />
            <Button type="primary" onClick={handleAddProduct} loading={isTodoLoading} style={{ width: '100%' }}>
              Qo'shish
            </Button>
          </Space>
        </Card>
      )}

      <Card title="Mahsulotlar Ro'yxati" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <List loading={isTodoLoading} itemLayout="horizontal" dataSource={todos}
          locale={{ emptyText: "Mahsulotlar yo'q" }}
          renderItem={(todo) => (
            <List.Item
              actions={[
                canWrite && <Button type="text" icon={<EditOutlined />} onClick={() => { setEditingTodo(todo); setEditModalVisible(true); }} />,
                canDelete && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(todo.id)} />,
              ].filter(Boolean) as React.ReactNode[]}
            >
              <List.Item.Meta
                title={<Text strong>{todo.title}</Text>}
                description={
                  <Space direction="vertical" size={2}>
                    <Text type="secondary">{todo.short_description}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{todo.description}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal title="Mahsulotni tahrirlash" open={editModalVisible}
        onOk={handleUpdateProduct} onCancel={() => setEditModalVisible(false)}
        okText="Saqlash" cancelText="Bekor qilish">
        <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
          <Input placeholder="Nomi" value={editingTodo?.title}
            onChange={(e) => setEditingTodo(p => p ? { ...p, title: e.target.value } : null)} />
          <Input placeholder="Qisqacha" value={editingTodo?.short_description}
            onChange={(e) => setEditingTodo(p => p ? { ...p, short_description: e.target.value } : null)} />
          <Input.TextArea placeholder="To'liq ta'rifi" value={editingTodo?.description}
            onChange={(e) => setEditingTodo(p => p ? { ...p, description: e.target.value } : null)} />
        </Space>
      </Modal>
    </div>
  );
};
