import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Warehouse,
    Users,
    ShoppingCart,
    ArrowLeft,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/produtos', icon: Package, label: 'Produtos' },
    { to: '/admin/estoque', icon: Warehouse, label: 'Estoque' },
    { to: '/admin/usuarios', icon: Users, label: 'Usuários' },
    { to: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-navy text-white flex flex-col fixed h-full">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-wider">MENDONÇA DREAMS</h1>
                    <p className="text-xs text-white/60 mt-1">Painel Administrativo</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-sm font-medium">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-white/60 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <NavLink
                            to="/"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Voltar ao Site
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-white/10 hover:bg-red-500/50 rounded-lg transition-colors"
                            title="Sair"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
