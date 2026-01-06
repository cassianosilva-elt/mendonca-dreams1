import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { getProducts, deleteProduct, importGenericProducts } from '../../services/admin';
import { useProducts } from '../../context/ProductContext';
import { Product, ProductFormData } from '../../types';
import { CATEGORIES } from '../../constants';
import { IS_MOCK_MODE } from '../../services/supabase';

const ProductManagement: React.FC = () => {
    const navigate = useNavigate();
    const { refreshProducts } = useProducts();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todos');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null }>({
        isOpen: false,
        product: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter]);

    const fetchProducts = async () => {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
        setIsLoading(false);
    };

    const handleSyncGeneric = async () => {
        if (IS_MOCK_MODE) return;

        setIsSyncing(true);
        const result = await importGenericProducts();
        setIsSyncing(false);

        if (result.success) {
            if (result.count > 0) {
                alert(`${result.count} produtos sincronizados com sucesso!`);
                await refreshProducts();
                fetchProducts();
            } else {
                alert('Todos os produtos genéricos já estão sincronizados.');
            }
        } else {
            alert('Erro ao sincronizar produtos. Tente novamente.');
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(term) ||
                    p.slug.toLowerCase().includes(term) ||
                    p.category.toLowerCase().includes(term)
            );
        }

        if (categoryFilter !== 'Todos') {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        setFilteredProducts(filtered);
    };

    const handleDelete = async () => {
        if (!deleteModal.product) return;

        setIsDeleting(true);
        const success = await deleteProduct(deleteModal.product.id);

        if (success) {
            await refreshProducts();
            setProducts((prev) => prev.filter((p) => p.id !== deleteModal.product!.id));
        } else {
            alert('Erro ao excluir produto. Tente novamente.');
        }

        setIsDeleting(false);
        setDeleteModal({ isOpen: false, product: null });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const columns = [
        {
            key: 'image',
            header: 'Imagem',
            render: (product: Product) => (
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                />
            ),
        },
        { key: 'name', header: 'Nome' },
        { key: 'category', header: 'Categoria' },
        {
            key: 'price',
            header: 'Preço',
            render: (product: Product) => formatCurrency(product.price),
        },
        {
            key: 'sizes',
            header: 'Tamanhos',
            render: (product: Product) => product.sizes.join(', '),
        },
        {
            key: 'colors',
            header: 'Cores',
            render: (product: Product) => (
                <div className="flex gap-1">
                    {product.colors.map((color) => (
                        <div
                            key={color.name}
                            title={color.name}
                            className="w-5 h-5 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                        />
                    ))}
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (product: Product) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/produtos/${product.id}/editar`);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ isOpen: true, product });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                        disabled={IS_MOCK_MODE || !product.id.includes('-')} // Only allow deleting real UUID products
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
                        <p className="text-gray-500 mt-1">Gerencie seus produtos</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSyncGeneric}
                            disabled={isSyncing || IS_MOCK_MODE}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            title="Importar produtos genéricos para o banco de dados"
                        >
                            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                            Sincronizar Genéricos
                        </button>
                        <button
                            onClick={() => navigate('/admin/produtos/novo')}
                            disabled={IS_MOCK_MODE}
                            className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={20} />
                            Novo Produto
                        </button>
                    </div>
                </div>

                {IS_MOCK_MODE && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        ⚠️ Modo demonstração: Criar, editar e excluir produtos não está disponível.
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50 bg-white"
                    >
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Products Table */}
                <DataTable
                    data={filteredProducts}
                    columns={columns}
                    keyExtractor={(product) => product.id}
                    emptyMessage="Nenhum produto encontrado"
                    isLoading={isLoading}
                />
            </div>

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Excluir Produto"
                message={`Tem certeza que deseja excluir "${deleteModal.product?.name}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, product: null })}
                isLoading={isDeleting}
            />
        </AdminLayout>
    );
};

export default ProductManagement;
