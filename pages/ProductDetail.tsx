import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { useWishlist } from '../context/WishlistContext';

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

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
      window.scrollTo(0, 0);
    }
  }, [product, slug]);

  if (!product) return <div className="py-40 text-center font-serif text-navy">Produto não encontrado na Maison.</div>;

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
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-12">
          <Link to="/" className="hover:text-navy transition">Home</Link>
          <ChevronRight size={10} />
          <Link to="/colecoes" className="hover:text-navy transition">Coleções</Link>
          <ChevronRight size={10} />
          <span className="text-navy font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            <div className="flex lg:flex-col gap-4 overflow-x-auto hide-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-24 border-2 transition-all ${selectedImage === idx ? 'border-navy' : 'border-transparent opacity-60'}`}
                >
                  <OptimizedImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] overflow-hidden bg-gray-50 relative group">
              <OptimizedImage
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                priority={true}
              />
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
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-navy mb-4">Cor: {selectedColor}</p>
              <div className="flex space-x-3">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border transition-all ${selectedColor === color.name ? 'border-navy scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-navy">Tamanho: {selectedSize}</p>
                <button className="text-[10px] tracking-[0.2em] underline text-navy/40 uppercase hover:text-navy transition">Guia de Medidas</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 text-[11px] font-bold border transition-all ${selectedSize === size ? 'bg-navy text-white border-navy' : 'bg-transparent text-navy border-gray-100 hover:border-navy'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4 mb-16">
              <div className="flex space-x-4">
                <button
                  onClick={() => addToCart(product, selectedSize, selectedColor)}
                  className="flex-1 bg-navy text-white py-5 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all shadow-xl"
                >
                  Adicionar à Sacola
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
                onClick={() => addToCart(product, selectedSize, selectedColor)}
                className="w-full bg-transparent border border-navy text-navy py-5 text-[11px] tracking-[0.3em] font-bold uppercase text-center hover:bg-navy hover:text-white transition-all"
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
            <h2 className="text-4xl md:text-5xl font-serif text-navy italic">Mais da Coleção Maison</h2>
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
