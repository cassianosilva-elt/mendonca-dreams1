import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Warehouse,
    Users,
    ShoppingCart,
    ArrowLeft,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('adminSidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('adminSidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-navy text-white flex flex-col fixed h-full z-20"
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between relative overflow-hidden h-[93px]">
                    <AnimatePresence mode="wait">
                        {!isCollapsed ? (
                            <motion.div
                                key="expanded-logo"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="whitespace-nowrap"
                            >
                                <h1 className="text-xl font-bold tracking-wider">MENDONÇA DREAMS</h1>
                                <p className="text-xs text-white/60 mt-1">Painel Administrativo</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="collapsed-logo"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="w-full flex justify-center"
                            >
                                <div className="text-xl font-bold bg-white/10 w-10 h-10 flex items-center justify-center rounded-lg">
                                    M
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-2 px-3">
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${isActive
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <item.icon size={20} className="shrink-0" />
                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2 overflow-hidden">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                            <span className="text-sm font-medium">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-white/60 truncate">{user?.email}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-2">
                        <NavLink
                            to="/"
                            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors overflow-hidden ${isCollapsed ? 'p-2' : ''}`}
                            title={isCollapsed ? "Voltar ao Site" : ""}
                        >
                            <ArrowLeft size={16} className="shrink-0" />
                            {!isCollapsed && <span className="whitespace-nowrap">Voltar ao Site</span>}
                        </NavLink>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`flex-1 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors`}
                                title={isCollapsed ? "Expandir" : "Recolher"}
                            >
                                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 bg-white/10 hover:bg-red-500/50 rounded-lg transition-colors"
                                title="Sair"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                animate={{ marginLeft: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1 min-h-screen"
            >
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </motion.main>
        </div>
    );
};

export default AdminLayout;
