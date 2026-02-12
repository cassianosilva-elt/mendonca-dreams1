import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, Heart, AlertCircle } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { useWishlist } from '../context/WishlistContext';
import { ProductInventory } from '../types';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const { getProductBySlug, products } = useProducts();
  const product = getProductBySlug(slug || '');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [inventory, setInventory] = useState<ProductInventory[]>([]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
      window.scrollTo(0, 0);

      const fetchInventory = async () => {
        if (!convexClient) return;
        try {
          const data = await convexClient.query(api.inventory.getByProductId, { productId: product.id as any });
          const mapped = (data || []).map((item: any) => ({
            id: item._id,
            productId: item.productId,
            productName: product.name,
            colorName: item.colorName,
            size: item.size,
            quantity: item.quantity,
            updatedAt: item._creationTime ? new Date(item._creationTime).toISOString() : '',
          }));
          setInventory(mapped);
        } catch (error) {
          console.error('Error fetching inventory:', error);
        }
      };
      fetchInventory();
    }
  }, [product, slug]);

  const checkStock = (size: string, color: string) => {
    if (inventory.length === 0) return true; // Assume in stock if inventory not loaded or in mock mode
    const item = inventory.find(i => i.size === size && i.colorName === color);
    return item ? item.quantity > 0 : false;
  };

  const isCurrentVariantInStock = checkStock(selectedSize, selectedColor);

  if (!product) return <div className="py-40 text-center font-serif text-navy">Produto não encontrado.</div>;

  const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id);
  const otherProducts = products.filter(p => p.category !== product.category && p.id !== product.id);
  const recommendedProducts = [...sameCategory, ...otherProducts].slice(0, 4);

  return (
    <div className="pt-24 pb-20 bg-white">
      <SEO
        title={product.name}
        description={product.description}
        image={product.images[0]}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.name,
          "image": product.images,
          "description": product.description,
          "brand": {
            "@type": "Brand",
            "name": "Mendonça Dreams"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "BRL",
            "price": product.price,
            "availability": isCurrentVariantInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        })}
      </script>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-12">
          <Link to="/" className="hover:text-navy transition">Home</Link>
          <ChevronRight size={10} />
          <Link to="/colecoes" className="hover:text-navy transition">Coleções</Link>
          <ChevronRight size={10} />
          <span className="text-navy font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-start">
          <div className="flex flex-col-reverse lg:flex-row gap-6 items-start">
            <div className="flex lg:flex-col gap-4 overflow-x-auto hide-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-24 border transition-all ${selectedImage === idx ? 'border-navy' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                >
                  <OptimizedImage src={img} alt="" className="w-full object-cover" style={{ aspectRatio: '3/4' }} />
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden bg-gray-50 relative group">
              {product.videoUrl ? (
                <div className="w-full h-full">
                  {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') || product.videoUrl.includes('vimeo.com') ? (
                    <iframe
                      src={product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be')
                        ? `https://www.youtube.com/embed/${product.videoUrl.split('v=')[1] || product.videoUrl.split('/').pop()}`
                        : `https://player.vimeo.com/video/${product.videoUrl.split('/').pop()}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={product.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                    ></video>
                  )}
                </div>
              ) : (
                <OptimizedImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={true}
                  style={{ aspectRatio: '3/4' }}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <p className="text-xs tracking-[0.4em] text-navy/40 uppercase mb-4 font-semibold">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-navy mb-6">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-8">
              <p className="text-2xl font-light text-navy">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-400 italic">em até 10x de R$ {(product.price / 10).toLocaleString('pt-BR')}</p>
            </div>

            <p className="text-gray-500 font-light leading-relaxed mb-10 text-lg">{product.description}</p>

            <div className="mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-navy mb-4 flex justify-between">
                <span>Cor: {selectedColor}</span>
              </p>
              <div className="flex space-x-3">
                {product.colors.map(color => {
                  const hasStockInAtLeastOneSize = product.sizes.some(size => checkStock(size, color.name));
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      disabled={!hasStockInAtLeastOneSize}
                      className={`w-8 h-8 rounded-full border transition-all ${selectedColor === color.name ? 'border-navy scale-110' : 'border-transparent'} ${!hasStockInAtLeastOneSize ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      title={hasStockInAtLeastOneSize ? color.name : `${color.name} - Indisponível`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-navy">Tamanho: {selectedSize}</p>
                <button className="text-[10px] tracking-[0.2em] underline text-navy/40 uppercase hover:text-navy transition">Guia de Medidas</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => {
                  const isAvailable = checkStock(size, selectedColor);
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`px-6 py-3 text-[11px] font-bold border transition-all ${selectedSize === size ? 'bg-navy text-white border-navy' : 'bg-transparent text-navy border-gray-100 hover:border-navy'} ${!isAvailable ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col space-y-4 mb-16">
              {!isCurrentVariantInStock && (
                <div className="bg-red-50 p-4 border border-red-100 flex items-center space-x-3 mb-4 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} className="text-red-500" />
                  <p className="text-[10px] tracking-widest font-bold uppercase text-red-500">
                    Infelizmente este tamanho e cor estão temporariamente indisponíveis.
                  </p>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={() => addToCart(product, selectedSize, selectedColor)}
                  disabled={!isCurrentVariantInStock}
                  className="flex-1 bg-navy text-white py-5 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all shadow-xl disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                >
                  {isCurrentVariantInStock ? 'Adicionar à Sacola' : 'Peça Indisponível'}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`px-6 border transition-all ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-transparent border-navy text-navy hover:bg-navy hover:text-white'}`}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <Link
                to="/checkout"
                onClick={(e) => {
                  if (!isCurrentVariantInStock) {
                    e.preventDefault();
                    return;
                  }
                  addToCart(product, selectedSize, selectedColor);
                }}
                className={`w-full bg-transparent border border-navy text-navy py-5 text-[11px] tracking-[0.3em] font-bold uppercase text-center hover:bg-navy hover:text-white transition-all ${!isCurrentVariantInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Comprar Agora
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-8 mb-12">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck size={18} className="text-navy/40" />
                <p className="text-[9px] uppercase tracking-widest font-bold">Frete Grátis</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 border-x border-gray-100">
                <ShieldCheck size={18} className="text-navy/40" />
                <p className="text-[9px] uppercase tracking-widest font-bold">Garantia MD</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RotateCcw size={18} className="text-navy/40" />
                <p className="text-[9px] uppercase tracking-widest font-bold">Troca Fácil</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-8 border-b border-gray-100">
                {['details', 'composition', 'shipping'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] tracking-[0.3em] uppercase font-bold transition-all relative ${activeTab === tab ? 'text-navy' : 'text-gray-300'}`}
                  >
                    {tab === 'details' ? 'Detalhes' : tab === 'composition' ? 'Composição' : 'Entrega'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-navy" />}
                  </button>
                ))}
              </div>
              <div className="py-6">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {activeTab === 'details' && product.details}
                  {activeTab === 'composition' && product.composition}
                  {activeTab === 'shipping' && 'Prazo médio de entrega de 3 a 7 dias úteis para todo o Brasil. Produção artesanal sob demanda.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-40">
          <ReviewSection />
        </div>

        <section className="mt-40 border-t border-gray-50 pt-32">
          <div className="text-center mb-20">
            <span className="text-navy/40 text-[9px] tracking-[0.5em] uppercase mb-4 block font-bold italic">Curadoria Especial</span>
            <h2 className="text-4xl md:text-5xl font-serif text-navy italic">Mais da Coleção</h2>
            <div className="w-12 h-px bg-navy/20 mx-auto mt-8"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {recommendedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/colecoes"
              className="text-[10px] tracking-[0.4em] font-bold text-navy uppercase border-b border-navy/20 pb-2 hover:border-navy transition-all"
            >
              Ver Todas as Peças
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
