import React, { useState, useEffect, useCallback } from 'react';
import {
  Button, Input, Table, Card, Typography, Space, message,
  Select, Modal, TreeSelect, Tag, Popconfirm, Spin
} from 'antd';
import {
  DeleteOutlined, EditOutlined, PlusOutlined,
  UserOutlined, LockOutlined, UserAddOutlined
} from '@ant-design/icons';
import { API } from '@/services/api';
import { useAppStore } from '../../../store/useAppStore';
import { Permissions } from '@/constants/permissions';

const { Title, Text } = Typography;

const permissionLabels: Record<string, string> = {
  [Permissions.READ_PRODUCT]: "Mahsulot ko'rish",
  [Permissions.WRITE_PRODUCT]: 'Mahsulot yaratish',
  [Permissions.DELETE_PRODUCT]: "Mahsulot o'chirish",
  [Permissions.READ_USER]: "User ko'rish",
  [Permissions.WRITE_USER]: 'User yaratish',
  [Permissions.EDIT_USER]: 'User tahrirlash',
  [Permissions.PAGE1_ACCESS]: 'Page1 kirish',
  [Permissions.PAGE2_ACCESS]: 'Page2 kirish',
};

const treeData = [
  {
    title: 'Umumiy ruxsatlar', value: 'standard', selectable: false,
    children: [
      { title: "Mahsulot ko'rish", value: Permissions.READ_PRODUCT },
      { title: 'Mahsulot yaratish', value: Permissions.WRITE_PRODUCT },
      { title: "Mahsulot o'chirish", value: Permissions.DELETE_PRODUCT },
      { title: "User ko'rish", value: Permissions.READ_USER },
      { title: 'User yaratish', value: Permissions.WRITE_USER },
      { title: 'User tahrirlash', value: Permissions.EDIT_USER },
    ],
  },
  ...['PAGE1', 'PAGE2'].map(page => ({
    title: `${page} Tabs`, value: page, selectable: false,
    children: [
      { title: 'Sahifaga kirish', value: Permissions[`${page}_ACCESS` as keyof typeof Permissions] as string },
      ...[1, 2, 3, 4, 5].map(tab => ({
        title: `Tab ${tab}`,
        value: Permissions[`${page}_TAB${tab}` as keyof typeof Permissions] as string,
      })),
    ],
  })),
];

interface Profile { id: number; name: string; access: string[]; }

const AdminManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const { user: currentUser } = useAppStore();
  const isMainAdmin = currentUser?.isMainAdmin;
  const isAdmin = currentUser?.role === 'admin';
  const perms = currentUser?.permissions || [];

  // Can this user manage (create/edit/delete)?
  const canWrite = isAdmin || perms.includes(Permissions.WRITE_USER);
  const canEdit  = isAdmin || perms.includes(Permissions.EDIT_USER);
  const canDelete = isAdmin;
  const readOnly = !canWrite && !canEdit && !canDelete;

  // Profile modal
  const [profileModal, setProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', access: [] as string[] });
  const [profileSaving, setProfileSaving] = useState(false);

  // Create user modal (at top of Users table)
  const [createUserModal, setCreateUserModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({ name: '', role_id: 1, login: '', password: '' });
  const [isCreating, setIsCreating] = useState(false);

  // Edit user
  const [editingUser, setEditingUser] = useState<any>(null);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await API.users.getAll();
      setUsers(res.data.data || res.data);
    } catch { message.error('Foydalanuvchilarni yuklashda xatolik'); }
    finally { setUsersLoading(false); }
  }, []);

  const fetchProfiles = useCallback(async () => {
    setProfilesLoading(true);
    try {
      const res = await API.permissionProfiles.getAll();
      setProfiles(res.data);
    } catch { message.error('Profillarni yuklashda xatolik'); }
    finally { setProfilesLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); fetchProfiles(); }, []);

  /* ---- Profile CRUD ---- */
  const saveProfile = async () => {
    if (!profileForm.name.trim()) return message.warning('Ism kiriting!');
    setProfileSaving(true);
    try {
      await API.permissionProfiles.create(profileForm);
      message.success('Profil saqlandi!');
      setProfileModal(false);
      setProfileForm({ name: '', access: [] });
      fetchProfiles();
    } catch { message.error('Saqlashda xatolik'); }
    finally { setProfileSaving(false); }
  };

  const deleteProfile = async (id: number) => {
    if (!canDelete) return;
    try {
      await API.permissionProfiles.delete(id);
      message.success("O'chirildi");
      fetchProfiles();
    } catch { message.error('Xatolik'); }
  };

  /* ---- Open create user modal ---- */
  const openCreateUser = () => {
    setSelectedProfileId(profiles.length > 0 ? profiles[0].id : null);
    setUserForm({ name: '', role_id: 1, login: '', password: '' });
    setCreateUserModal(true);
  };

  /* Auto-fill login from name */
  const handleNameChange = (name: string) => {
    const autoLogin = name.toLowerCase().replace(/\s+/g, '.');
    setUserForm(f => ({ ...f, name, login: autoLogin }));
  };

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  const handleCreateUser = async () => {
    if (!selectedProfileId) return message.warning('Profil tanlang!');
    if (!userForm.name.trim()) return message.warning('Ismni kiriting!');
    if (!userForm.login.trim()) return message.warning('Loginni kiriting!');
    if (userForm.password.length < 4) return message.warning('Parol kamida 4 ta belgi!');
    setIsCreating(true);
    try {
      await API.users.create({
        name: userForm.name,
        login: userForm.login,
        password: userForm.password,
        role_id: userForm.role_id,
        access: selectedProfile?.access || [],
      });
      message.success(`${userForm.name} muvaffaqiyatli yaratildi!`);
      setCreateUserModal(false);
      fetchUsers();
    } catch (e: any) {
      if (e.response?.status === 422) {
        Object.entries(e.response.data.errors || {}).forEach(([k, v]: any) =>
          message.error(`${k}: ${v.join(', ')}`)
        );
      } else { message.error(e.response?.data?.message || 'Xatolik'); }
    } finally { setIsCreating(false); }
  };

  /* ---- Edit/delete user ---- */
  const handleUpdateUser = async () => {
    if (!editingUser.name.trim() || !editingUser.login.trim()) return message.warning('Ism va loginni kiriting!');
    try {
      await API.users.update(editingUser.id, {
        name: editingUser.name, login: editingUser.login,
        role_id: editingUser.role_id, access: editingUser.access,
        password: editingUser.password || undefined,
      });
      message.success('Yangilandi!');
      setEditingUser(null);
      fetchUsers();
    } catch { message.error('Yangilashda xatolik'); }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await API.users.delete(id);
      message.success("O'chirildi!");
      fetchUsers();
    } catch { message.error('Xatolik'); }
  };

  /* ---- Columns ---- */
  const profileColumns = [
    {
      title: 'Profil nomi', dataIndex: 'name', key: 'name',
      render: (n: string) => (
        <Text strong><LockOutlined style={{ color: '#1677ff', marginRight: 6 }} />{n}</Text>
      ),
    },
    {
      title: 'Ruxsatlar', dataIndex: 'access', key: 'access',
      render: (access: string[]) => (
        <Space wrap size={[4, 4]}>
          {!access?.length
            ? <Text type="secondary">Hech qanday ruxsat yo'q</Text>
            : access.slice(0, 4).map(p => <Tag color="blue" key={p}>{permissionLabels[p] || p}</Tag>)}
          {access?.length > 4 && <Tag>+{access.length - 4} ta</Tag>}
        </Space>
      ),
    },
    {
      title: 'Amallar', key: 'actions', width: 80,
      render: (_: any, record: Profile) => {
        if (readOnly) return null;
        return (
          <Popconfirm title="O'chirishni tasdiqlaysizmi?" onConfirm={() => deleteProfile(record.id)} okText="Ha" cancelText="Yo'q">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        );
      },
    },
  ];

  const userColumns = [
    {
      title: 'Ism', dataIndex: 'name', key: 'name',
      render: (n: string, r: any) => (
        <Space>
          <UserOutlined />
          <Text strong>{n}</Text>
          {r.id === currentUser?.id && <Tag color="green">Siz</Tag>}
        </Space>
      ),
    },
    { title: 'Login', dataIndex: 'login', key: 'login', render: (l: string) => <Text code>{l}</Text> },
    {
      title: 'Rol', dataIndex: 'role_id', key: 'role_id',
      render: (rid: number) => <Tag color={rid === 2 ? 'gold' : 'default'}>{rid === 2 ? 'Manager' : 'User'}</Tag>,
    },
    {
      title: 'Ruxsatlar', dataIndex: 'access', key: 'access',
      render: (access: string[]) => (
        <Space wrap size={[4, 4]}>
          {Array.isArray(access) && access.length > 0
            ? access.slice(0, 3).map(p => <Tag color="blue" key={p} style={{ fontSize: 11 }}>{permissionLabels[p] || p}</Tag>)
            : <Text type="secondary">Yo'q</Text>}
          {Array.isArray(access) && access.length > 3 && <Tag>+{access.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Amallar', key: 'actions', width: 100,
      render: (_: any, record: any) => {
        if (record.login === 'admin') return null;
        if (readOnly) return null;
        return (
          <Space>
            <Button size="small" icon={<EditOutlined />}
              onClick={() => setEditingUser({ ...record, password: '' })}
              disabled={!canEdit}
            />
            <Popconfirm title="O'chirishni tasdiqlaysizmi?" onConfirm={() => handleDeleteUser(record.id)} okText="Ha" cancelText="Yo'q">
              <Button size="small" danger icon={<DeleteOutlined />}
                disabled={!canDelete}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={4} style={{ margin: 0 }}>Foydalanuvchilar Boshqaruvi</Title>

      {readOnly && (
        <div style={{
          background: '#fffbe6',
          border: '1px solid #ffe58f',
          borderRadius: 8,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <LockOutlined style={{ color: '#faad14' }} />
          <span style={{ color: '#614700' }}>Siz bu sahifani faqat <b>ko'rish</b> huquqiga egasiz. Amallar amalga oshirish uchun admin bilan bog'laning.</span>
        </div>
      )}

      {/* Table 1: Permission profiles */}
      <Card
        title={<Space><LockOutlined style={{ color: '#1677ff' }} /><span>Ruxsat Profillari</span></Space>}
        bordered={false}
        extra={
          !readOnly && (
            <Button type="primary" size="small" icon={<PlusOutlined />}
              onClick={() => { setProfileForm({ name: '', access: [] }); setProfileModal(true); }}>
              Profil qo'shish
            </Button>
          )
        }
      >
        <Spin spinning={profilesLoading}>
          <Table dataSource={profiles} columns={profileColumns} rowKey="id" size="small"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "Hali profil qo'shilmagan" }}
          />
        </Spin>
      </Card>

      {/* Table 2: Users — button at the TOP */}
      <Card
        title={<Space><UserOutlined style={{ color: '#52c41a' }} /><span>Foydalanuvchilar</span></Space>}
        bordered={false}
        extra={
          !readOnly && (
            <Button type="primary" size="small" icon={<UserAddOutlined />}
              onClick={openCreateUser}
              disabled={!canWrite}
            >
              User yaratish
            </Button>
          )
        }
      >
        <Table loading={usersLoading}
          dataSource={users.filter(u => isMainAdmin ? true : u.login !== 'admin')}
          columns={userColumns} rowKey="id" size="small" pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* === Create user modal === */}
      <Modal
        title={<Space><UserAddOutlined /><span>Yangi User Yaratish</span></Space>}
        open={createUserModal}
        onOk={handleCreateUser}
        onCancel={() => setCreateUserModal(false)}
        okText="Yaratish"
        cancelText="Bekor"
        width={500}
        confirmLoading={isCreating}
        destroyOnClose
      >
        <div style={formStyle}>
          {/* Profile selector */}
          <div>
            <Text strong>Ruxsat profili tanlang: <Text type="danger">*</Text></Text>
            <Select
              style={{ width: '100%', marginTop: 4 }}
              placeholder="Profil tanlang..."
              value={selectedProfileId}
              onChange={val => setSelectedProfileId(val)}
              options={profiles.map(p => ({ label: p.name, value: p.id }))}
              notFoundContent={<Text type="secondary">Profil yo'q, avval profil qo'shing</Text>}
            />
            {selectedProfile && selectedProfile.access.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <Space wrap size={[4, 4]}>
                  {selectedProfile.access.slice(0, 5).map(p =>
                    <Tag color="blue" key={p} style={{ fontSize: 11 }}>{permissionLabels[p] || p}</Tag>
                  )}
                  {selectedProfile.access.length > 5 && <Tag>+{selectedProfile.access.length - 5}</Tag>}
                </Space>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <Text strong>Foydalanuvchi ismi: <Text type="danger">*</Text></Text>
            <Input
              placeholder="Ism (masalan: Ali Valiyev)"
              value={userForm.name}
              onChange={e => handleNameChange(e.target.value)}
              style={{ marginTop: 4 }}
            />
          </div>

          {/* Role */}
          <div>
            <Text strong>Rol:</Text>
            <Select
              value={userForm.role_id}
              onChange={val => setUserForm(f => ({ ...f, role_id: val }))}
              style={{ width: '100%', marginTop: 4 }}
              options={[
                { label: 'User', value: 1 },
                ...(isMainAdmin ? [{ label: 'Manager', value: 2 }] : []),
              ]}
            />
          </div>

          {/* Login + Password */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Text strong>Login: <Text type="danger">*</Text></Text>
              <Input
                placeholder="Login"
                value={userForm.login}
                onChange={e => setUserForm(f => ({ ...f, login: e.target.value }))}
                style={{ marginTop: 4 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong>Parol: <Text type="danger">*</Text></Text>
              <Input.Password
                placeholder="min 4 ta belgi"
                value={userForm.password}
                onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                style={{ marginTop: 4 }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Add profile modal */}
      <Modal title="Yangi Ruxsat Profili" open={profileModal}
        onOk={saveProfile} onCancel={() => setProfileModal(false)}
        okText="Saqlash" cancelText="Bekor" width={520} confirmLoading={profileSaving} destroyOnClose
      >
        <div style={formStyle}>
          <div>
            <Text strong>Profil nomi: <Text type="danger">*</Text></Text>
            <Input placeholder='Masalan: "Operator", "Analitik"'
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <Text strong>Ruxsatlarni tanlang:</Text>
            <TreeSelect treeData={treeData} value={profileForm.access}
              onChange={val => setProfileForm({ ...profileForm, access: val })}
              treeCheckable showCheckedStrategy={TreeSelect.SHOW_CHILD}
              placeholder="Ruxsatlarni belgilang"
              style={{ width: '100%', marginTop: 4 }} maxTagCount={6} allowClear treeDefaultExpandAll
            />
          </div>
        </div>
      </Modal>

      {/* Edit user modal */}
      <Modal title="Foydalanuvchini Tahrirlash" open={!!editingUser}
        onOk={handleUpdateUser} onCancel={() => setEditingUser(null)}
        okText="Saqlash" cancelText="Bekor" width={540} destroyOnClose
      >
        {editingUser && (
          <div style={formStyle}>
            <div>
              <Text strong>Ruxsatlar:</Text>
              <TreeSelect treeData={treeData} value={editingUser.access}
                onChange={val => setEditingUser({ ...editingUser, access: val })}
                treeCheckable showCheckedStrategy={TreeSelect.SHOW_CHILD}
                placeholder="Ruxsatlarni tanlang" style={{ width: '100%', marginTop: 4 }} maxTagCount={5} allowClear
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Text strong>Rol:</Text>
                <Select value={editingUser.role_id} onChange={val => setEditingUser({ ...editingUser, role_id: val })}
                  style={{ width: '100%', marginTop: 4 }}
                  options={[{ label: 'User', value: 1 }, ...(isMainAdmin ? [{ label: 'Manager', value: 2 }] : [])]}
                />
              </div>
              <div style={{ flex: 2 }}>
                <Text strong>Ism:</Text>
                <Input value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} style={{ marginTop: 4 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Text strong>Login:</Text>
                <Input value={editingUser.login}
                  onChange={e => setEditingUser({ ...editingUser, login: e.target.value })} style={{ marginTop: 4 }} />
              </div>
              <div style={{ flex: 1 }}>
                <Text strong>Yangi parol (ixtiyoriy):</Text>
                <Input.Password placeholder="Bo'sh = o'zgarmaydi"
                  value={editingUser.password}
                  onChange={e => setEditingUser({ ...editingUser, password: e.target.value })} style={{ marginTop: 4 }} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default AdminManagement;
