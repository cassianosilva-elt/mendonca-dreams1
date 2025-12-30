
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-60 text-center container mx-auto px-6">
        <h2 className="text-4xl font-serif text-navy mb-8">Sua sacola está vazia</h2>
        <p className="text-gray-400 font-light mb-12">Nenhum item adicionado ainda. Explore nossas coleções exclusivas.</p>
        <Link to="/colecoes" className="bg-navy text-white px-12 py-5 text-[11px] tracking-[0.3em] font-bold uppercase inline-block">
          Ver Coleções
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-40 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-5xl font-serif text-navy mb-20 text-center">Sacola de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* List */}
          <div className="lg:col-span-8">
            <div className="border-t border-gray-100">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex py-10 border-b border-gray-100">
                  <div className="w-24 h-32 md:w-32 md:h-44 bg-gray-50 overflow-hidden flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 ml-6 md:ml-10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif text-navy tracking-wide">{item.name}</h3>
                        <p className="text-lg text-navy">R$ {(item.price * item.quantity).toLocaleString('pt-BR')}</p>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-6">
                        {item.selectedColor} / {item.selectedSize}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-gray-100 rounded-sm">
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="p-2 hover:bg-gray-50 transition"><Minus size={14} /></button>
                        <span className="px-4 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="p-2 hover:bg-gray-50 transition"><Plus size={14} /></button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 p-10 sticky top-40">
              <h4 className="text-[10px] tracking-[0.4em] uppercase font-bold text-navy mb-10 border-b border-navy/10 pb-4">Resumo do Pedido</h4>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-navy">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Entrega</span>
                  <span className="text-navy font-bold uppercase tracking-tighter">Grátis</span>
                </div>
                <div className="pt-6 border-t border-navy/10 flex justify-between items-end">
                  <span className="text-lg font-serif italic text-navy">Total</span>
                  <span className="text-2xl font-bold text-navy">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-navy text-white py-5 text-[11px] tracking-[0.3em] font-bold uppercase block text-center shadow-2xl hover:bg-navy/90 transition-all"
              >
                Ir para o Pagamento
              </Link>
              <Link to="/colecoes" className="block text-center mt-6 text-[9px] uppercase tracking-widest text-navy/40 hover:text-navy transition">
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
