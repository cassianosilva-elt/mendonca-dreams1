import React, { useEffect, useState, useMemo } from 'react';
import { Search, Save, ChevronDown, ChevronRight, Package, Loader2, Edit3, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getInventory, saveInventoryItem, getProducts } from '../../services/admin';
import { ProductInventory, Product } from '../../types';
import { IS_MOCK_MODE } from '../../services/admin';

const InventoryRow: React.FC<{
    productName: string;
    items: ProductInventory[];
    onBatchSave: (updates: { item: ProductInventory, quantity: number }[]) => Promise<void>;
    isSaving: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
}> = ({ productName, items, onBatchSave, isSaving, isExpanded, onToggleExpand }) => {
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

    useEffect(() => {
        // Initialize local quantities when entering batch mode
        if (isBatchMode) {
            const initial: Record<string, number> = {};
            items.forEach(item => {
                initial[item.id] = item.quantity;
            });
            setLocalQuantities(initial);
        }
    }, [isBatchMode, items]);

    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = items.filter(item => item.quantity < 3).length;
    const outOfStockCount = items.filter(item => item.quantity === 0).length;

    const handleBatchSave = async () => {
        const updates = items
            .filter(item => localQuantities[item.id] !== undefined && localQuantities[item.id] !== item.quantity)
            .map(item => ({ item, quantity: localQuantities[item.id] }));

        if (updates.length > 0) {
            await onBatchSave(updates);
        }
        setIsBatchMode(false);
    };

    const handleQuickIncrement = (id: string, amount: number) => {
        setLocalQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + amount)
        }));
    };

    return (
        <div className={`border rounded-xl overflow-hidden bg-white mb-4 transition-all ${isExpanded ? 'border-navy/20 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
            {/* Main Product Row */}
            <div
                className={`flex items-center p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-navy/[0.02]' : 'hover:bg-gray-50'}`}
                onClick={onToggleExpand}
            >
                <div className="flex-1 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-navy text-white' : 'bg-gray-50 text-gray-400'}`}>
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{productName}</h3>
                        <p className="text-xs text-gray-500">{items.length} variações</p>
                    </div>
                </div>

                <div className="flex items-center gap-8 px-6">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Estoque Total</p>
                        <p className={`text-lg font-bold ${totalStock === 0 ? 'text-red-600' : 'text-navy'}`}>
                            {totalStock} <span className="text-xs font-normal text-gray-500">unid.</span>
                        </p>
                    </div>

                    <div className="hidden sm:flex gap-2">
                        {outOfStockCount > 0 && (
                            <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-md border border-red-100">
                                {outOfStockCount} Esgotado
                            </span>
                        )}
                        {lowStockCount > 0 && (
                            <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded-md border border-orange-100">
                                {lowStockCount} Crítico
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Variations List (Expanded) */}
            {isExpanded && (
                <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Opções de Variação</span>
                        <div className="flex gap-2">
                            {isBatchMode ? (
                                <>
                                    <button
                                        onClick={() => setIsBatchMode(false)}
                                        className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:bg-white rounded-lg transition-colors border border-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleBatchSave}
                                        disabled={isSaving}
                                        className="px-4 py-1.5 text-xs font-bold bg-navy text-white rounded-lg transition-all hover:bg-navy/90 flex items-center gap-2 shadow-sm disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Salvar Mudanças
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsBatchMode(true);
                                    }}
                                    className="px-4 py-1.5 text-xs font-bold text-navy hover:bg-white rounded-lg transition-all border border-navy/20 flex items-center gap-2"
                                >
                                    <Edit3 size={14} />
                                    Edição Rápida
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-400 uppercase text-[10px] tracking-widest font-bold">
                                <tr>
                                    <th className="px-6 py-4">Cor / Tamanho</th>
                                    <th className="px-6 py-4">Quantidade</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-900">{item.colorName}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold text-gray-600">{item.size}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isBatchMode ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                                        <button
                                                            onClick={() => handleQuickIncrement(item.id, -1)}
                                                            className="px-3 py-1 text-gray-400 hover:bg-gray-50 hover:text-navy transition-colors font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={localQuantities[item.id] ?? item.quantity}
                                                            onChange={(e) => setLocalQuantities({ ...localQuantities, [item.id]: parseInt(e.target.value) || 0 })}
                                                            className="w-14 text-center py-1 text-sm font-bold text-navy focus:outline-none border-x border-gray-100"
                                                        />
                                                        <button
                                                            onClick={() => handleQuickIncrement(item.id, 1)}
                                                            className="px-3 py-1 text-gray-400 hover:bg-gray-50 hover:text-navy transition-colors font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => handleQuickIncrement(item.id, 5)} className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 rounded hover:border-navy/30 hover:text-navy transition-all">+5</button>
                                                        <button onClick={() => handleQuickIncrement(item.id, 10)} className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 rounded hover:border-navy/30 hover:text-navy transition-all">+10</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 group">
                                                    <span className={`px-4 py-1.5 rounded-lg font-bold border ${item.quantity === 0 ? 'bg-red-50 text-red-600 border-red-100' : item.quantity < 3 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-50 text-navy border-gray-200'}`}>
                                                        {item.quantity} unidades
                                                    </span>
                                                    <button
                                                        onClick={() => setIsBatchMode(true)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-navy/40 hover:text-navy hover:bg-white rounded-md transition-all border border-transparent hover:border-gray-100"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.quantity === 0 ? (
                                                <div className="flex items-center gap-2 text-red-500">
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Esgotado</span>
                                                </div>
                                            ) : item.quantity < 3 ? (
                                                <div className="flex items-center gap-2 text-orange-500">
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Crítico</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <CheckCircle2 size={12} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Disponível</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const InventoryManagement: React.FC = () => {
    const [inventory, setInventory] = useState<ProductInventory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [productFilter, setProductFilter] = useState('all');
    const [isSaving, setIsSaving] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const [inventoryData, productsData] = await Promise.all([
            getInventory(),
            getProducts()
        ]);
        setInventory(inventoryData);
        setProducts(productsData);
        setIsLoading(false);
    };

    const handleBatchSave = async (updates: { item: ProductInventory, quantity: number }[]) => {
        if (IS_MOCK_MODE) {
            alert('Não é possível salvar em modo demonstração');
            return;
        }

        setIsSaving(true);
        let allSuccess = true;

        for (const update of updates) {
            const success = await saveInventoryItem(update.item, update.quantity);
            if (!success) {
                allSuccess = false;
                alert(`Erro ao atualizar estoque para ${update.item.productName} (${update.item.colorName} - ${update.item.size})`);
                break;
            }
        }

        if (allSuccess) {
            await fetchData();
        }
        setIsSaving(false);
    };

    const toggleExpand = (name: string) => {
        setExpandedProducts(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const groupedInventory = useMemo(() => {
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

        // Group by product name
        const groups: Record<string, ProductInventory[]> = {};
        filtered.forEach(item => {
            if (!groups[item.productName]) {
                groups[item.productName] = [];
            }
            groups[item.productName].push(item);
        });

        return groups;
    }, [inventory, searchTerm, productFilter]);

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Estoque Mendonça Dreams</h1>
                        <p className="text-gray-500 mt-1">Gestão inteligente e rápida de disponibilidade</p>
                    </div>
                    <div className="bg-navy p-3 rounded-2xl text-white shadow-lg shadow-navy/20">
                        <Package size={24} />
                    </div>
                </div>

                {IS_MOCK_MODE && (
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800 flex items-center gap-3">
                        <span className="text-lg">⚠️</span>
                        <span>Modo demonstração: As alterações não serão salvas permanentemente.</span>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por produto, cor ou tamanho..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy/50 bg-white transition-all shadow-sm"
                        />
                    </div>
                    <select
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy/50 bg-white shadow-sm min-w-[220px] font-medium text-gray-700"
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
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-hover hover:shadow-md">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Total SKU</p>
                        <p className="text-3xl font-bold text-navy">{inventory.length}</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm transition-hover hover:shadow-md">
                        <p className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest mb-1">Esgotados</p>
                        <p className="text-3xl font-bold text-red-600">
                            {inventory.filter((i) => i.quantity === 0).length}
                        </p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 shadow-sm transition-hover hover:shadow-md">
                        <p className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest mb-1">Críticos</p>
                        <p className="text-3xl font-bold text-orange-600">
                            {inventory.filter((i) => i.quantity > 0 && i.quantity < 3).length}
                        </p>
                    </div>
                    <div className="bg-navy p-6 rounded-3xl border border-navy/10 shadow-sm transition-hover hover:shadow-md text-white">
                        <p className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest mb-1">Linhas Ativas</p>
                        <p className="text-3xl font-bold">{Object.keys(groupedInventory).length}</p>
                    </div>
                </div>

                {/* Grouped List */}
                <div className="space-y-3 pb-20">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4 text-gray-400">
                            <Loader2 size={48} className="animate-spin text-navy" />
                            <p className="text-sm font-bold tracking-widest uppercase">Atualizando Inventário...</p>
                        </div>
                    ) : Object.keys(groupedInventory).length === 0 ? (
                        <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                            <Package size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-500 font-medium">Nenhum resultado para sua busca.</p>
                        </div>
                    ) : (
                        Object.entries(groupedInventory).map(([name, items]) => (
                            <InventoryRow
                                key={name}
                                productName={name}
                                items={items}
                                onBatchSave={handleBatchSave}
                                isSaving={isSaving}
                                isExpanded={!!expandedProducts[name]}
                                onToggleExpand={() => toggleExpand(name)}
                            />
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default InventoryManagement;
