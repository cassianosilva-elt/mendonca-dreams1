import React, { useEffect, useState } from 'react';
import { Search, Eye, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/admin';
import { Order } from '../../types';
import { IS_MOCK_MODE } from '../../services/supabase';

const statusLabels: Record<Order['status'], string> = {
    pending: 'Aguardando Pagamento',
    processing: 'Pagamento Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
};

const statusColors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-green-100 text-green-800 border-green-200',
    shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    delivered: 'bg-navy/10 text-navy border-navy/20',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, statusFilter]);

    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err: any) {
            console.error('Error in fetchOrders:', err);
            setError(err.message || 'Erro ao carregar pedidos');
        } finally {
            setIsLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.id.toLowerCase().includes(term) ||
                    order.userName?.toLowerCase().includes(term) ||
                    order.userEmail?.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    };

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        if (IS_MOCK_MODE) {
            alert('Não é possível atualizar em modo demonstração');
            return;
        }

        setUpdatingOrderId(orderId);
        const success = await updateOrderStatus(orderId, newStatus);

        if (success) {
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } else {
            alert('Erro ao atualizar status do pedido');
        }

        setUpdatingOrderId(null);
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (IS_MOCK_MODE) {
            alert('Não é possível excluir em modo demonstração');
            return;
        }

        if (!confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
            return;
        }

        setUpdatingOrderId(orderId);
        const success = await deleteOrder(orderId);

        if (success) {
            setOrders((prev) => prev.filter((order) => order.id !== orderId));
            setExpandedOrder(null);
        } else {
            alert('Erro ao excluir pedido');
        }

        setUpdatingOrderId(null);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns = [
        {
            key: 'id',
            header: 'Pedido',
            render: (order: Order) => (
                <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
            ),
        },
        { key: 'userName', header: 'Cliente' },
        {
            key: 'total',
            header: 'Total',
            render: (order: Order) => (
                <span className="font-medium">{formatCurrency(order.total)}</span>
            ),
        },
        {
            key: 'items',
            header: 'Itens',
            render: (order: Order) => (
                <span className="text-gray-600">{order.items.length} produto(s)</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (order: Order) => (
                <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    disabled={updatingOrderId === order.id || IS_MOCK_MODE}
                    className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${statusColors[order.status]} disabled:cursor-not-allowed`}
                >
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            ),
        },
        {
            key: 'createdAt',
            header: 'Data',
            render: (order: Order) => (
                <span className="text-gray-600 text-sm">{formatDate(order.createdAt)}</span>
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (order: Order) => (
                <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver detalhes"
                >
                    {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
                    <p className="text-gray-500 mt-1">Gerencie os pedidos da loja</p>
                </div>

                {IS_MOCK_MODE && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        ⚠️ Modo demonstração: As alterações não serão salvas.
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        ❌ Erro ao buscar pedidos: {error}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por pedido, cliente ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50 bg-white"
                    >
                        <option value="all">Todos os Status</option>
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map(
                        (status) => (
                            <div
                                key={status}
                                className={`p-4 rounded-xl border ${statusColors[status].replace('text-', 'border-')}`}
                            >
                                <p className="text-sm opacity-80">{statusLabels[status]}</p>
                                <p className="text-2xl font-bold">
                                    {orders.filter((o) => o.status === status).length}
                                </p>
                            </div>
                        )
                    )}
                </div>

                {/* Orders Table */}
                <div className="space-y-4">
                    <DataTable
                        data={filteredOrders}
                        columns={columns}
                        keyExtractor={(order) => order.id}
                        emptyMessage="Nenhum pedido encontrado"
                        isLoading={isLoading}
                    />

                    {/* Expanded Order Details */}
                    {expandedOrder && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                            {(() => {
                                const order = orders.find((o) => o.id === expandedOrder);
                                if (!order) return null;

                                return (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">
                                                Detalhes do Pedido #{order.id.slice(0, 8)}
                                            </h3>
                                            <button
                                                onClick={() => setExpandedOrder(null)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Customer Info */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                                                <p className="text-gray-600">{order.userName}</p>
                                                <p className="text-gray-600">{order.userEmail}</p>
                                            </div>

                                            {/* Shipping Address */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h4>
                                                <p className="text-gray-600">
                                                    {order.shippingAddress.street}, {order.shippingAddress.number}
                                                    {order.shippingAddress.complement && ` - ${order.shippingAddress.complement}`}
                                                </p>
                                                <p className="text-gray-600">
                                                    {order.shippingAddress.neighborhood} - {order.shippingAddress.city}/{order.shippingAddress.state}
                                                </p>
                                                <p className="text-gray-600">CEP: {order.shippingAddress.zipCode}</p>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="md:col-span-2 border-t pt-4">
                                                <h4 className="font-medium text-gray-900 mb-3">Ações Rápidas</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, 'processing')}
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                                        >
                                                            Confirmar Pagamento
                                                        </button>
                                                    )}
                                                    {order.status === 'processing' && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, 'shipped')}
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                        >
                                                            Marcar como Enviado
                                                        </button>
                                                    )}
                                                    {order.status === 'shipped' && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, 'delivered')}
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy/90 transition-colors flex items-center gap-2"
                                                        >
                                                            Confirmar Entrega
                                                        </button>
                                                    )}
                                                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-4 py-2 bg-white text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                                        >
                                                            Cancelar Pedido
                                                        </button>
                                                    )}
                                                    {(() => {
                                                        const phone = (order.userPhone || (order.shippingAddress as any).phone || '').replace(/\D/g, '');
                                                        const whatsappUrl = phone ? `https://wa.me/${phone.length <= 11 ? '55' : ''}${phone}` : null;

                                                        if (!whatsappUrl) return null;

                                                        return (
                                                            <a
                                                                href={whatsappUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                                            >
                                                                Falar com Cliente (WhatsApp)
                                                            </a>
                                                        );
                                                    })()}
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        disabled={updatingOrderId === order.id}
                                                        className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        <Trash2 size={14} />
                                                        Excluir Pedido
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Itens do Pedido</h4>
                                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.productName}</p>
                                                            <p className="text-sm text-gray-500">
                                                                Tamanho: {item.size} | Cor: {item.color} | Qtd: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                                    </div>
                                                ))}
                                                <div className="border-t pt-3 flex justify-between">
                                                    <span className="font-semibold">Total</span>
                                                    <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderManagement;
