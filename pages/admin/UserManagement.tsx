import React, { useEffect, useState } from 'react';
import { Search, Shield, ShieldOff } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { getUsers, toggleUserAdmin } from '../../services/admin';
import { User } from '../../types';
import { IS_MOCK_MODE } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';


const UserManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [adminModal, setAdminModal] = useState<{
        isOpen: boolean;
        user: User | null;
        action: 'promote' | 'demote';
    }>({
        isOpen: false,
        user: null,
        action: 'promote',
    });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
        setIsLoading(false);
    };

    const filterUsers = () => {
        if (!searchTerm) {
            setFilteredUsers(users);
            return;
        }

        const term = searchTerm.toLowerCase();
        setFilteredUsers(
            users.filter(
                (user) =>
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term)
            )
        );
    };

    const handleToggleAdmin = async () => {
        if (!adminModal.user) return;

        setIsUpdating(true);
        const newAdminStatus = adminModal.action === 'promote';
        const success = await toggleUserAdmin(adminModal.user.id, newAdminStatus);

        if (success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === adminModal.user!.id ? { ...u, isAdmin: newAdminStatus } : u
                )
            );
        } else {
            alert('Erro ao atualizar permissões');
        }

        setIsUpdating(false);
        setAdminModal({ isOpen: false, user: null, action: 'promote' });
    };

    const columns = [
        {
            key: 'avatar',
            header: '',
            render: (user: User) => (
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-navy">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                </div>
            ),
        },
        { key: 'name', header: 'Nome' },
        { key: 'email', header: 'Email' },
        {
            key: 'phone',
            header: 'Telefone',
            render: (user: User) => user.phone || '-',
        },
        {
            key: 'role',
            header: 'Função',
            render: (user: User) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${user.isAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {user.isAdmin ? 'Admin' : 'Cliente'}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (user: User) => {
                // Don't allow user to demote themselves
                if (user.id === currentUser?.id) return null;

                return (
                    <button
                        onClick={() =>
                            setAdminModal({
                                isOpen: true,
                                user,
                                action: user.isAdmin ? 'demote' : 'promote',
                            })
                        }
                        disabled={IS_MOCK_MODE}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${user.isAdmin
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-purple-600 hover:bg-purple-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={user.isAdmin ? 'Remover admin' : 'Tornar admin'}
                    >
                        {user.isAdmin ? <ShieldOff size={16} /> : <Shield size={16} />}
                        {user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                    </button>
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
                    <p className="text-gray-500 mt-1">Gerencie os usuários da loja</p>
                </div>

                {IS_MOCK_MODE && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        ⚠️ Modo demonstração: As alterações não serão salvas.
                    </div>
                )}

                {/* Search */}
                <div className="relative max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                    />
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Total de Usuários</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <p className="text-sm text-purple-600">Administradores</p>
                        <p className="text-2xl font-bold text-purple-700">
                            {users.filter((u) => u.isAdmin).length}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-600">Clientes</p>
                        <p className="text-2xl font-bold text-blue-700">
                            {users.filter((u) => !u.isAdmin).length}
                        </p>
                    </div>
                </div>

                {/* Users Table */}
                <DataTable
                    data={filteredUsers}
                    columns={columns}
                    keyExtractor={(user) => user.id}
                    emptyMessage="Nenhum usuário encontrado"
                    isLoading={isLoading}
                />
            </div>

            {/* Admin Toggle Modal */}
            <ConfirmModal
                isOpen={adminModal.isOpen}
                title={adminModal.action === 'promote' ? 'Promover a Admin' : 'Remover Admin'}
                message={
                    adminModal.action === 'promote'
                        ? `Tem certeza que deseja tornar "${adminModal.user?.name}" um administrador? Administradores têm acesso total ao painel de gestão.`
                        : `Tem certeza que deseja remover "${adminModal.user?.name}" como administrador?`
                }
                confirmLabel={adminModal.action === 'promote' ? 'Promover' : 'Remover'}
                variant={adminModal.action === 'promote' ? 'info' : 'danger'}
                onConfirm={handleToggleAdmin}
                onCancel={() => setAdminModal({ isOpen: false, user: null, action: 'promote' })}
                isLoading={isUpdating}
            />
        </AdminLayout>
    );
};

export default UserManagement;
