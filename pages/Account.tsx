import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { LogOut, Package, Heart, Settings, User as UserIcon, MapPin, CreditCard, ChevronRight, Trash2, ShoppingBag, Shield, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { User, UserPreferences, Order } from '../types';
import { useGenderedLanguage } from '../hooks/useGenderedLanguage';
import { getUserOrders } from '../services/supabase';

const Account = () => {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { translate, t } = useGenderedLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const data = await getUserOrders(user.id);
          setOrders(data as any);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user, activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'orders', icon: <Package size={18} />, label: 'Meus Pedidos' },
    { id: 'wishlist', icon: <Heart size={18} />, label: 'Wishlist' },
    { id: 'data', icon: <UserIcon size={18} />, label: 'Meus Dados' },
    { id: 'preferences', icon: <Settings size={18} />, label: 'Preferências' },
  ];

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-gray-100 pb-12">
          <div>
            <p className="text-navy/40 text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold">Painel d{t('a', 'o')} {translate('client')}</p>
            <h1 className="text-5xl font-serif text-navy">{translate('welcome')}, <span className="italic">{user?.name.split(' ')[0]}</span>.</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-[10px] tracking-[0.3em] font-bold text-red-400 hover:text-red-600 transition-colors uppercase mt-8 md:mt-0"
          >
            <LogOut size={16} />
            <span>Encerrar Sessão</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar */}
          <div className="space-y-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center space-x-4 p-5 text-[11px] tracking-[0.2em] font-bold uppercase transition-all ${activeTab === item.id ? 'bg-navy text-white shadow-lg lg:-translate-r-2' : 'text-gray-400 hover:bg-gray-50'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Admin Panel Link - Only for admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="w-full flex items-center space-x-4 p-5 text-[11px] tracking-[0.2em] font-bold uppercase transition-all bg-gradient-to-r from-purple-600 to-navy text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <Shield size={18} />
                <span>Painel Admin</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && <OrdersContent navigate={navigate} orders={orders} isLoading={isLoadingOrders} />}
            {activeTab === 'wishlist' && <WishlistContent wishlist={wishlist} removeFromWishlist={removeFromWishlist} navigate={navigate} />}
            {activeTab === 'data' && <UserDataForm user={user} updateProfile={updateProfile} />}
            {activeTab === 'preferences' && <PreferencesForm user={user} updateProfile={updateProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-components --- */

const OrdersContent = ({ navigate, orders, isLoading }: { navigate: any, orders: Order[], isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-navy/40 text-[10px] tracking-[0.5em] uppercase font-bold">Buscando Pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 p-12 text-center border border-gray-100">
        <Package size={48} className="mx-auto text-navy/10 mb-8" />
        <h3 className="text-2xl font-serif text-navy mb-4 italic">Nenhum pedido recente</h3>
        <p className="text-gray-400 text-sm font-light max-w-sm mx-auto mb-10">
          Suas encomendas futuras aparecerão aqui assim que forem processadas em nosso ateliê.
        </p>
        <button
          onClick={() => navigate('/colecoes')}
          className="bg-navy text-white px-10 py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all"
        >
          Explorar Maison
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-8 py-4 flex flex-wrap justify-between items-center border-b border-gray-100 gap-4">
            <div className="flex space-x-8">
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-1">Pedido</p>
                <p className="text-[10px] tracking-wider text-navy font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-1">Data</p>
                <p className="text-[10px] tracking-wider text-navy font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-1">Total</p>
                <p className="text-[10px] tracking-wider text-navy font-bold">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-full">
              <div className="flex items-center space-x-2">
                {order.status === 'pending' && <Clock size={12} className="text-amber-500" />}
                {order.status === 'processing' && <Package size={12} className="text-blue-500" />}
                {order.status === 'shipped' && <Truck size={12} className="text-blue-500" />}
                {order.status === 'delivered' && <CheckCircle size={12} className="text-green-500" />}
                {order.status === 'cancelled' && <XCircle size={12} className="text-red-500" />}
                <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-navy">
                  {order.status === 'pending' && 'Pagamento Pendente'}
                  {order.status === 'processing' && 'Em Produção'}
                  {order.status === 'shipped' && 'Enviado'}
                  {order.status === 'delivered' && 'Entregue'}
                  {order.status === 'cancelled' && 'Cancelado'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-6">
                  <div className="w-16 h-20 bg-gray-50 flex-shrink-0">
                    {/* Simplified item display without image for now as it's not in OrderItem type */}
                    <div className="w-full h-full flex items-center justify-center text-navy/20">
                      <ShoppingBag size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-serif text-navy font-bold">{item.productName}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                      Tam: {item.size} • Cor: {item.color} • Qtd: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const WishlistContent = ({ wishlist, removeFromWishlist, navigate }: { wishlist: any[], removeFromWishlist: any, navigate: any }) => (
  <div>
    {wishlist.length === 0 ? (
      <div className="bg-gray-50 p-12 text-center border border-gray-100">
        <Heart size={48} className="mx-auto text-navy/10 mb-8" />
        <h3 className="text-2xl font-serif text-navy mb-4 italic">Sua lista está vazia</h3>
        <p className="text-gray-400 text-sm font-light max-w-sm mx-auto mb-10">
          Salve suas peças favoritas para encontrá-las facilmente depois.
        </p>
        <button
          onClick={() => navigate('/colecoes')}
          className="bg-navy text-white px-10 py-4 text-[11px] tracking-[0.3em] font-bold uppercase"
        >
          Explorar Coleções
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {wishlist.map(product => (
          <div key={product.id} className="group relative">
            <ProductCard product={product} />
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-navy opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const UserDataForm = ({ user, updateProfile }: { user: User | null, updateProfile: any }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    birthDate: user?.birthDate || '',
    address: {
      street: user?.address?.street || '',
      number: user?.address?.number || '',
      complement: user?.address?.complement || '',
      neighborhood: user?.address?.neighborhood || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  // CEP Lookup Effect
  React.useEffect(() => {
    const cep = formData.address.zipCode.replace(/\D/g, '');
    if (cep.length === 8) {
      const fetchAddress = async () => {
        setIsSearchingCEP(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                street: data.logradouro || prev.address.street,
                neighborhood: data.bairro || prev.address.neighborhood,
                city: data.localidade || prev.address.city,
                state: data.uf || prev.address.state,
              }
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        } finally {
          setIsSearchingCEP(false);
        }
      };
      fetchAddress();
    }
  }, [formData.address.zipCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      alert('Dados atualizados com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar dados.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let finalValue = value;

    // Simple Masking
    if (name === 'address.zipCode') {
      finalValue = value.replace(/\D/g, '').slice(0, 8);
      if (finalValue.length > 5) {
        finalValue = `${finalValue.slice(0, 5)}-${finalValue.slice(5)}`;
      }
    } else if (name === 'phone') {
      finalValue = value.replace(/\D/g, '').slice(0, 11);
      if (finalValue.length > 2) {
        finalValue = `(${finalValue.slice(0, 2)}) ${finalValue.slice(2)}`;
      }
      if (finalValue.length > 9) {
        finalValue = `${finalValue.slice(0, 10)}-${finalValue.slice(10)}`;
      }
    } else if (name === 'cpf') {
      finalValue = value.replace(/\D/g, '').slice(0, 11);
      if (finalValue.length > 3) finalValue = `${finalValue.slice(0, 3)}.${finalValue.slice(3)}`;
      if (finalValue.length > 7) finalValue = `${finalValue.slice(0, 7)}.${finalValue.slice(7)}`;
      if (finalValue.length > 11) finalValue = `${finalValue.slice(0, 11)}-${finalValue.slice(11)}`;
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: finalValue
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div>
        <h3 className="text-xl font-serif text-navy mb-8 italic">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nome Completo" name="name" value={formData.name} onChange={handleChange} />
          <Input label="E-mail" name="email" value={formData.email} disabled />
          <Input label="Telefone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
          <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
          <Input label="Data de Nascimento" name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-serif text-navy mb-8 italic">Endereço de Entrega</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input label="Rua / Logradouro" name="address.street" value={formData.address.street} onChange={handleChange} />
          </div>
          <Input label="Número" name="address.number" value={formData.address.number} onChange={handleChange} />
          <Input label="Complemento" name="address.complement" value={formData.address.complement} onChange={handleChange} />
          <Input label="Bairro" name="address.neighborhood" value={formData.address.neighborhood} onChange={handleChange} />
          <div className="relative">
            <Input label="CEP" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} placeholder="00000-000" />
            {isSearchingCEP && (
              <span className="absolute right-0 bottom-3 text-[8px] text-navy animate-pulse uppercase tracking-widest font-bold">Buscando...</span>
            )}
          </div>
          <Input label="Cidade" name="address.city" value={formData.address.city} onChange={handleChange} />
          <Input label="Estado" name="address.state" value={formData.address.state} onChange={handleChange} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="bg-navy text-white px-12 py-5 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all disabled:opacity-50"
      >
        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  );
};

const PreferencesForm = ({ user, updateProfile }: { user: User | null, updateProfile: any }) => {
  const [prefs, setPrefs] = useState<UserPreferences>(user?.preferences || {
    newsletter: true,
    smsNotifications: false,
    stylePreference: 'Classic',
    language: 'pt-BR'
  });

  const [gender, setGender] = useState(user?.gender || '');

  const toggle = (key: keyof UserPreferences) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    updateProfile({ preferences: newPrefs });
  };

  const setStyle = (style: UserPreferences['stylePreference']) => {
    const newPrefs = { ...prefs, stylePreference: style };
    setPrefs(newPrefs);
    updateProfile({ preferences: newPrefs });
  };

  const handleGenderChange = (newGender: 'female' | 'male' | 'other') => {
    setGender(newGender);
    updateProfile({ gender: newGender });
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-xl font-serif text-navy mb-8 italic">Identidade</h3>
        <p className="text-gray-400 text-sm mb-8 font-light">Como você prefere ser identificada na Maison.</p>
        <div className="flex gap-4">
          <button
            onClick={() => handleGenderChange('female')}
            className={`flex-1 p-6 border text-[10px] tracking-[0.2em] font-bold uppercase transition-all flex items-center justify-center gap-3 ${gender === 'female' ? 'bg-navy text-white border-navy shadow-lg' : 'border-gray-100 text-gray-400 hover:border-navy hover:text-navy'
              }`}
          >
            <Heart size={16} />
            Feminino
          </button>
          <button
            onClick={() => handleGenderChange('male')}
            className={`flex-1 p-6 border text-[10px] tracking-[0.2em] font-bold uppercase transition-all flex items-center justify-center gap-3 ${gender === 'male' ? 'bg-navy text-white border-navy shadow-lg' : 'border-gray-100 text-gray-400 hover:border-navy hover:text-navy'
              }`}
          >
            <UserIcon size={16} />
            Masculino
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-serif text-navy mb-8 italic">Notificações</h3>
        <div className="space-y-6">
          <Toggle label="Newsletter Mendonça Dreams" sub="Receba convites para desfiles, novos lançamentos e editoriais." active={prefs.newsletter} onToggle={() => toggle('newsletter')} />
          <Toggle label="Alertas de Pedido via SMS" sub="Acompanhe o status da sua produção artesanal em tempo real." active={prefs.smsNotifications} onToggle={() => toggle('smsNotifications')} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-serif text-navy mb-8 italic">Curadoria de Estilo</h3>
        <p className="text-gray-400 text-sm mb-8 font-light">Selecione seu estilo predominante para uma experiência personalizada na Maison.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Classic', 'Modern', 'Avant-garde', 'Minimalist'].map(style => (
            <button
              key={style}
              onClick={() => setStyle(style as any)}
              className={`p-6 border text-[10px] tracking-[0.2em] font-bold uppercase transition-all ${prefs.stylePreference === style ? 'bg-navy text-white border-navy shadow-lg' : 'border-gray-100 text-gray-400 hover:border-navy hover:text-navy'
                }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* --- UI Components --- */

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-navy/60">{label}</label>
    <input
      {...props}
      className="border-b border-gray-200 py-3 text-sm focus:border-navy outline-none transition-colors bg-transparent placeholder:text-gray-300"
    />
  </div>
);

const Toggle = ({ label, sub, active, onToggle }: any) => (
  <div className="flex items-center justify-between py-4 group">
    <div>
      <p className="text-sm font-bold text-navy uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xs text-gray-400 font-light">{sub}</p>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-navy' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default Account;
