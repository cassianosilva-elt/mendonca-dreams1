import React, { useEffect, useState } from 'react';
import { Search, Save } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { getInventory, updateInventory, getProducts } from '../../services/admin';
import { ProductInventory, Product } from '../../types';
import { IS_MOCK_MODE } from '../../services/supabase';

const InventoryManagement: React.FC = () => {
    const [inventory, setInventory] = useState<ProductInventory[]>([]);
    const [filteredInventory, setFilteredInventory] = useState<ProductInventory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [productFilter, setProductFilter] = useState('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingQuantity, setEditingQuantity] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterInventory();
    }, [inventory, searchTerm, productFilter]);

    const fetchData = async () => {
        setIsLoading(true);
        const [inventoryData, productsData] = await Promise.all([
            getInventory(),
            getProducts(),
        ]);
        setInventory(inventoryData);
        setProducts(productsData);
        setIsLoading(false);
    };

    const filterInventory = () => {
        let filtered = [...inventory];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    item.productName.toLowerCase().includes(term) ||
                    item.colorName.toLowerCase().includes(term) ||
                    item.size.toLowerCase().includes(term)
            );
        }

        if (productFilter !== 'all') {
            filtered = filtered.filter((item) => item.productId === productFilter);
        }

        setFilteredInventory(filtered);
    };

    const handleEdit = (item: ProductInventory) => {
        setEditingId(item.id);
        setEditingQuantity(item.quantity);
    };

    const handleSave = async (item: ProductInventory) => {
        if (IS_MOCK_MODE) {
            alert('Não é possível salvar em modo demonstração');
            setEditingId(null);
            return;
        }

        setIsSaving(true);
        const success = await updateInventory(item.id, editingQuantity);

        if (success) {
            setInventory((prev) =>
                prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: editingQuantity } : i
                )
            );
        } else {
            alert('Erro ao atualizar estoque');
        }

        setIsSaving(false);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const columns = [
        { key: 'productName', header: 'Produto' },
        { key: 'colorName', header: 'Cor' },
        { key: 'size', header: 'Tamanho' },
        {
            key: 'quantity',
            header: 'Quantidade',
            render: (item: ProductInventory) => {
                if (editingId === item.id) {
                    return (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                value={editingQuantity}
                                onChange={(e) => setEditingQuantity(parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-navy/50"
                                autoFocus
                            />
                            <button
                                onClick={() => handleSave(item)}
                                disabled={isSaving}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Salvar"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                title="Cancelar"
                            >
                                ✕
                            </button>
                        </div>
                    );
                }

                return (
                    <button
                        onClick={() => handleEdit(item)}
                        className={`px-3 py-1 rounded hover:bg-gray-100 transition-colors ${item.quantity < 3
                                ? 'text-red-600 font-semibold bg-red-50'
                                : item.quantity < 10
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-700'
                            }`}
                    >
                        {item.quantity} unid.
                    </button>
                );
            },
        },
        {
            key: 'status',
            header: 'Status',
            render: (item: ProductInventory) => {
                if (item.quantity === 0) {
                    return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Esgotado
                        </span>
                    );
                }
                if (item.quantity < 3) {
                    return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Crítico
                        </span>
                    );
                }
                if (item.quantity < 10) {
                    return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Baixo
                        </span>
                    );
                }
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        OK
                    </span>
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
                    <p className="text-gray-500 mt-1">Gerencie o estoque dos produtos</p>
                </div>

                {IS_MOCK_MODE && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        ⚠️ Modo demonstração: As alterações não serão salvas.
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por produto, cor ou tamanho..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                        />
                    </div>
                    <select
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50 bg-white"
                    >
                        <option value="all">Todos os Produtos</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Total de Itens</p>
                        <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <p className="text-sm text-red-600">Esgotados</p>
                        <p className="text-2xl font-bold text-red-700">
                            {inventory.filter((i) => i.quantity === 0).length}
                        </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <p className="text-sm text-orange-600">Estoque Crítico</p>
                        <p className="text-2xl font-bold text-orange-700">
                            {inventory.filter((i) => i.quantity > 0 && i.quantity < 3).length}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <p className="text-sm text-green-600">Estoque OK</p>
                        <p className="text-2xl font-bold text-green-700">
                            {inventory.filter((i) => i.quantity >= 10).length}
                        </p>
                    </div>
                </div>

                {/* Inventory Table */}
                <DataTable
                    data={filteredInventory}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    emptyMessage="Nenhum item de estoque encontrado"
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
};

export default InventoryManagement;
