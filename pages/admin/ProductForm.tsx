import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Upload, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getProducts, createProduct, updateProduct, uploadProductImage } from '../../services/admin';
import { useProducts } from '../../context/ProductContext';
import { Product, ProductFormData } from '../../types';
import { CATEGORIES } from '../../constants';
import { IS_MOCK_MODE } from '../../services/supabase';

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { refreshProducts } = useProducts();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        slug: '',
        category: 'Blazers',
        price: 0,
        images: [''],
        description: '',
        details: '',
        composition: '',
        sizes: [],
        colors: [],
    });

    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });

    useEffect(() => {
        if (isEditing && id) {
            fetchProduct();
        }
    }, [id, isEditing]);

    const fetchProduct = async () => {
        setIsLoading(true);
        const products = await getProducts();
        const product = products.find((p) => p.id === id);

        if (product) {
            setFormData({
                name: product.name,
                slug: product.slug,
                category: product.category,
                price: product.price,
                images: product.images,
                description: product.description,
                details: product.details,
                composition: product.composition,
                sizes: product.sizes,
                colors: product.colors,
            });
        }
        setIsLoading(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: isEditing ? prev.slug : generateSlug(value),
        }));
    };

    const handleAddImage = () => {
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ''],
        }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.map((img, i) => (i === index ? value : img)),
        }));
    };

    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log('File selected:', file);
        if (!file) return;

        if (IS_MOCK_MODE) {
            console.warn('Upload not available in mock mode');
            alert('Upload não disponível em modo demonstração');
            return;
        }

        setUploadingIndex(index);
        console.log('Starting upload for file:', file.name);
        try {
            const publicUrl = await uploadProductImage(file);
            console.log('Upload result (publicUrl):', publicUrl);
            setUploadingIndex(null);

            if (publicUrl) {
                handleImageChange(index, publicUrl);
            } else {
                console.error('Upload failed: publicUrl is null');
                alert('Erro ao fazer upload da imagem. Verifique o console para mais detalhes ou verifique se o bucket "products" existe e tem permissões públicas.');
            }
        } catch (error) {
            console.error('Error in handleFileUpload:', error);
            setUploadingIndex(null);
            alert('Erro inesperado durante o upload. Verifique o console.');
        }
    };

    const handleAddSize = () => {
        if (newSize && !formData.sizes.includes(newSize)) {
            setFormData((prev) => ({
                ...prev,
                sizes: [...prev.sizes, newSize],
            }));
            setNewSize('');
        }
    };

    const handleRemoveSize = (size: string) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((s) => s !== size),
        }));
    };

    const handleAddColor = () => {
        if (newColor.name && !formData.colors.find((c) => c.name === newColor.name)) {
            setFormData((prev) => ({
                ...prev,
                colors: [...prev.colors, { ...newColor }],
            }));
            setNewColor({ name: '', hex: '#000000' });
        }
    };

    const handleRemoveColor = (colorName: string) => {
        setFormData((prev) => ({
            ...prev,
            colors: prev.colors.filter((c) => c.name !== colorName),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (IS_MOCK_MODE) {
            alert('Não é possível salvar em modo demonstração');
            return;
        }

        // Validation
        if (!formData.name || !formData.slug || !formData.price || formData.images.filter(Boolean).length === 0) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        if (formData.sizes.length === 0) {
            alert('Adicione pelo menos um tamanho');
            return;
        }

        if (formData.colors.length === 0) {
            alert('Adicione pelo menos uma cor');
            return;
        }

        setIsSaving(true);

        const dataToSave = {
            ...formData,
            images: formData.images.filter(Boolean),
        };

        let success: boolean;
        if (isEditing && id) {
            // Check if id is a UUID (contains a dash). Generic IDs are '1', '2', etc.
            const isUuid = id.includes('-');
            if (isUuid) {
                success = await updateProduct(id, dataToSave);
            } else {
                // If it's a generic product not yet in DB, create it
                const newProduct = await createProduct(dataToSave);
                success = newProduct !== null;
            }
        } else {
            const newProduct = await createProduct(dataToSave);
            success = newProduct !== null;
        }

        setIsSaving(false);

        if (success) {
            await refreshProducts();
            navigate('/admin/produtos');
        } else {
            alert('Erro ao salvar produto. Tente novamente.');
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/produtos')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditing ? 'Editar Produto' : 'Novo Produto'}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {isEditing ? 'Atualize as informações do produto' : 'Adicione um novo produto à loja'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving || IS_MOCK_MODE}
                        className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>

                {IS_MOCK_MODE && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        ⚠️ Modo demonstração: Não é possível salvar alterações.
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Informações Básicas</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Produto *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Slug (URL)
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50 bg-gray-50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50 bg-white"
                                >
                                    {CATEGORIES.filter((c) => c !== 'Todos').map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preço *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Detalhes
                            </label>
                            <textarea
                                value={formData.details}
                                onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Composição
                            </label>
                            <input
                                type="text"
                                value={formData.composition}
                                onChange={(e) => setFormData((prev) => ({ ...prev, composition: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                            />
                        </div>
                    </div>

                    {/* Images, Sizes, Colors */}
                    <div className="space-y-6">
                        {/* Images */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Imagens</h2>
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="flex items-center gap-1 text-sm text-navy hover:text-navy/80"
                                >
                                    <Plus size={16} />
                                    Adicionar
                                </button>
                            </div>

                            {formData.images.map((image, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="url"
                                                placeholder="URL da imagem ou faça upload"
                                                value={image}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                                            />
                                            {image && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                    <img src={image} alt="Preview" className="w-8 h-8 object-cover rounded border border-gray-100" />
                                                </div>
                                            )}
                                        </div>

                                        <label className={`p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center min-w-[44px] ${uploadingIndex === index ? 'opacity-50 pointer-events-none' : ''}`}>
                                            {uploadingIndex === index ? (
                                                <Loader2 size={20} className="animate-spin text-navy" />
                                            ) : (
                                                <Upload size={20} className="text-gray-500" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileUpload(index, e)}
                                                disabled={uploadingIndex !== null}
                                            />
                                        </label>

                                        {formData.images.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sizes */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Tamanhos</h2>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ex: 38, M, G"
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSize}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.sizes.map((size) => (
                                    <span
                                        key={size}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                                    >
                                        {size}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSize(size)}
                                            className="hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Cores</h2>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nome da cor"
                                    value={newColor.name}
                                    onChange={(e) => setNewColor((prev) => ({ ...prev, name: e.target.value }))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/50"
                                />
                                <input
                                    type="color"
                                    value={newColor.hex}
                                    onChange={(e) => setNewColor((prev) => ({ ...prev, hex: e.target.value }))}
                                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddColor}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.colors.map((color) => (
                                    <span
                                        key={color.name}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                                    >
                                        <span
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        {color.name}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveColor(color.name)}
                                            className="hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
};

export default ProductForm;
