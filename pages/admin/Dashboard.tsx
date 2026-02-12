import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';
import { getDashboardStats, DashboardStats } from '../../services/admin';
import { Order, ProductInventory } from '../../types';
import { IS_MOCK_MODE } from '../../services/admin';

const statusLabels: Record<Order['status'], string> = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
};

const statusColors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const data = await getDashboardStats();
            setStats(data);
            setIsLoading(false);
        };
        fetchStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const orderColumns = [
        { key: 'id', header: 'Pedido', render: (order: Order) => `#${order.id.slice(0, 8)}` },
        { key: 'userName', header: 'Cliente' },
        {
            key: 'total',
            header: 'Total',
            render: (order: Order) => formatCurrency(order.total)
        },
        {
            key: 'status',
            header: 'Status',
            render: (order: Order) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                </span>
            ),
        },
        { key: 'createdAt', header: 'Data', render: (order: Order) => formatDate(order.createdAt) },
    ];

    const inventoryColumns = [
        { key: 'productName', header: 'Produto' },
        { key: 'colorName', header: 'Cor' },
        { key: 'size', header: 'Tamanho' },
        {
            key: 'quantity',
            header: 'Quantidade',
            render: (item: ProductInventory) => (
                <span className={item.quantity < 3 ? 'text-red-600 font-semibold' : ''}>
                    {item.quantity} unid.
                </span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Visão geral da sua loja</p>
                    {IS_MOCK_MODE && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                            ⚠️ Modo demonstração: Os dados exibidos são fictícios.
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        icon={Package}
                        title="Total de Produtos"
                        value={isLoading ? '-' : stats?.totalProducts || 0}
                        color="navy"
                    />
                    <StatsCard
                        icon={ShoppingCart}
                        title="Total de Pedidos"
                        value={isLoading ? '-' : stats?.totalOrders || 0}
                        color="purple"
                    />
                    <StatsCard
                        icon={Users}
                        title="Usuários Cadastrados"
                        value={isLoading ? '-' : stats?.totalUsers || 0}
                        color="green"
                    />
                    <StatsCard
                        icon={DollarSign}
                        title="Receita Total"
                        value={isLoading ? '-' : formatCurrency(stats?.totalRevenue || 0)}
                        color="orange"
                    />
                </div>

                {/* Recent Orders & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Recentes</h2>
                        <DataTable
                            data={stats?.recentOrders || []}
                            columns={orderColumns}
                            keyExtractor={(order) => order.id}
                            emptyMessage="Nenhum pedido encontrado"
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Low Stock Alert */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" size={20} />
                            Estoque Baixo
                        </h2>
                        <DataTable
                            data={stats?.lowStockItems || []}
                            columns={inventoryColumns}
                            keyExtractor={(item) => item.id}
                            emptyMessage="Todos os produtos com estoque adequado"
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
