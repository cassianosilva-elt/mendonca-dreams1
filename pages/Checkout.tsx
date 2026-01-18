import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/checkout';
import { ShieldCheck, CreditCard, Landmark, Lock, AlertCircle, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGenderedLanguage } from '../hooks/useGenderedLanguage';

const WHATSAPP_NUMBER = '5511960235151'; // Substitua pelo seu número

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const { translate } = useGenderedLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'shipping' | 'payment' | 'concluded'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'whatsapp'>('whatsapp');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(user?.address || {
    street: 'Av. Paulista',
    number: '1000',
    complement: 'Apto 102',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    birthDate: user?.birthDate || '',
  });

  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  React.useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    }
    if (user?.name || user?.email) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        cpf: user.cpf || '',
        birthDate: user.birthDate || '',
      });
    }
  }, [user]);

  // CEP Lookup Effect for Checkout
  React.useEffect(() => {
    const cep = shippingAddress.zipCode.replace(/\D/g, '');
    if (cep.length === 8) {
      const fetchAddress = async () => {
        setIsSearchingCEP(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (!data.erro) {
            setShippingAddress(prev => ({
              ...prev,
              street: data.logradouro || prev.street,
              neighborhood: data.bairro || prev.neighborhood,
              city: data.localidade || prev.city,
              state: data.uf || prev.state,
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
  }, [shippingAddress.zipCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'phone') {
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

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'zipCode') {
      finalValue = value.replace(/\D/g, '').slice(0, 8);
      if (finalValue.length > 5) {
        finalValue = `${finalValue.slice(0, 5)}-${finalValue.slice(5)}`;
      }
    }

    setShippingAddress(prev => ({ ...prev, [name]: finalValue }));
  };

  if (cart.length === 0 && step !== 'concluded') return <Navigate to="/carrinho" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Por favor, faça login para continuar.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    if (paymentMethod !== 'whatsapp') {
      alert('Esta forma de pagamento está temporariamente desabilitada. Por favor, utilize a opção WhatsApp.');
      setPaymentMethod('whatsapp');
      setLoading(false);
      return;
    }

    // If WhatsApp, we generate the message and redirect
    const orderSummary = cart.map(item => `- ${item.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity}: R$ ${item.price.toLocaleString('pt-BR')}`).join('%0A');
    const totalStr = total.toLocaleString('pt-BR');
    const fullAddress = `${shippingAddress.street}, ${shippingAddress.number}${shippingAddress.complement ? ` - ${shippingAddress.complement}` : ''}, ${shippingAddress.neighborhood}, ${shippingAddress.city} - ${shippingAddress.state}, ${shippingAddress.zipCode}`;

    let message = `Olá! Gostaria de finalizar o meu pedido na Mendonça Dreams:%0A%0A*Itens:*%0A${orderSummary}%0A%0A*Total:* R$ ${totalStr}%0A%0A*Endereço de Entrega:*%0A${fullAddress}%0A%0A*Cliente:* ${formData.name}%0A*E-mail:* ${formData.email}`;

    if (isGift) {
      message += `%0A%0A*OPÇÃO DE PRESENTE:*%0A- Embalagem Especial: Sim%0A- Mensagem: ${giftMessage || 'Sem mensagem'}`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    try {
      // 0. Update Profile with missing details if provided
      const updates: any = {};
      if (formData.phone && formData.phone !== user.phone) updates.phone = formData.phone;
      if (formData.cpf && formData.cpf !== user.cpf) updates.cpf = formData.cpf;
      if (formData.birthDate && formData.birthDate !== user.birthDate) updates.birthDate = formData.birthDate;

      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
      }

      // Create order in database
      const result = await createOrder({
        userId: user.id,
        userName: formData.name,
        userEmail: formData.email,
        items: cart,
        total: total,
        shippingAddress: shippingAddress,
        paymentMethod: 'whatsapp',
        paymentDetails: {}
      });

      if (result.success) {
        window.open(whatsappUrl, '_blank');
        clearCart();
        setStep('concluded');
      } else {
        setError(result.error || 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Ocorreu um erro inesperado ao processar seu pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'concluded') {
    return (
      <div className="pt-60 pb-40 text-center container mx-auto px-6">
        <div className="max-w-xl mx-auto bg-white p-12 shadow-2xl border border-gray-50">
          <div className="w-20 h-20 bg-navy text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl font-serif text-navy mb-6">Pedido Confirmado</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            {translate('thanks')}, {formData.name}. Seu pedido foi recebido e está em processamento artesanal em nosso ateliê. Em breve continuaremos o atendimento via WhatsApp.
          </p>
          <Link to="/" className="bg-navy text-white px-10 py-4 text-[11px] tracking-[0.3em] font-bold uppercase inline-block">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-40 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-serif text-navy mb-16 text-center italic">Finalização do Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping Info */}
            <div className="bg-white p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-navy">01. Endereço de Entrega</h3>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-[10px] font-bold text-navy/40 hover:text-navy transition-colors uppercase tracking-widest"
                >
                  {isEditingAddress ? 'CANCELAR' : 'EDITAR'}
                </button>
              </div>

              {!isEditingAddress ? (
                <div className="text-sm text-gray-500 space-y-2">
                  <p className="font-bold text-navy uppercase tracking-widest">{formData.name}</p>
                  <p>{shippingAddress.street}, {shippingAddress.number}{shippingAddress.complement ? ` - ${shippingAddress.complement}` : ''}</p>
                  <p>{shippingAddress.neighborhood}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state}</p>
                  <p>{shippingAddress.zipCode}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Nome Completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="relative">
                      <label className="text-[9px] uppercase tracking-widest text-navy font-bold block mb-2">CEP</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange}
                        placeholder="00000-000"
                        className="w-full border-b border-navy/20 bg-navy/[0.02] py-2 text-sm focus:outline-none focus:border-navy"
                      />
                      {isSearchingCEP && (
                        <span className="absolute right-0 bottom-10 text-[8px] text-navy animate-pulse uppercase tracking-widest font-bold">Buscando...</span>
                      )}
                      <p className="text-[9px] text-navy/40 mt-2 uppercase tracking-widest font-medium italic">
                        * Preencha o CEP para completar os outros campos automaticamente
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Rua / Logradouro</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Número</label>
                    <input
                      type="text"
                      name="number"
                      value={shippingAddress.number}
                      onChange={handleAddressChange}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Complemento</label>
                    <input
                      type="text"
                      name="complement"
                      value={shippingAddress.complement}
                      onChange={handleAddressChange}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Bairro</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={shippingAddress.neighborhood}
                      onChange={handleAddressChange}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Cidade</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Estado</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      maxLength={2}
                      className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button
                      onClick={() => setIsEditingAddress(false)}
                      className="bg-navy text-white px-8 py-3 text-[10px] tracking-[0.2em] uppercase font-bold"
                    >
                      Confirmar Dados
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info (Missing Profile Fields) */}
            {user && (!user.phone || !user.cpf || !user.birthDate) && (
              <div className="bg-white p-10 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                  <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-navy">Informações Complementares</h3>
                  <span className="text-[9px] text-navy/40 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 italic">Conclusão de Perfil</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!user.phone && (
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Telefone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(00) 00000-0000"
                        className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                        required
                      />
                    </div>
                  )}
                  {!user.cpf && (
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">CPF</label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                        className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy"
                        required
                      />
                    </div>
                  )}
                  {!user.birthDate && (
                    <div className="md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Data de Nascimento</label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-navy text-gray-400"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gift Options */}
            <div className="bg-white p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-navy flex items-center gap-2">
                  <Gift size={12} className="text-rose-400" />
                  02. Opções de Presente
                </h3>
                <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest bg-rose-50 px-3 py-1">Cortesia</span>
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="peer h-6 w-6 cursor-pointer appearance-none border-2 border-gray-200 transition-all checked:border-navy checked:bg-navy"
                    />
                    <svg
                      className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-navy font-bold text-xs uppercase tracking-widest group-hover:text-navy/70 transition-colors">
                    Este pedido é um presente
                  </span>
                </label>

                {isGift && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-6 pt-4"
                  >
                    <div className="p-6 bg-rose-50/50 border border-rose-100">
                      <p className="text-xs text-navy/70 leading-relaxed italic">
                        "Sua peça será enviada com nossa embalagem premium de seda e caixa exclusiva, sem custos adicionais."
                      </p>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-3">
                        Mensagem Personalizada (Opcional)
                      </label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Escreva aqui sua mensagem dedicada..."
                        maxLength={200}
                        className="w-full border border-gray-100 p-4 text-sm focus:outline-none focus:border-navy min-h-[100px] resize-none"
                      />
                      <p className="text-[8px] text-gray-400 text-right mt-1 uppercase tracking-widest">
                        {giftMessage.length} / 200 caracteres
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-navy">03. Método de Pagamento</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex items-center p-6 border-2 transition-all ${paymentMethod === 'credit_card' ? 'border-navy bg-white' : 'border-gray-100 bg-gray-50 opacity-60 hover:opacity-100'}`}
                >
                  <CreditCard size={20} className="text-navy mr-4" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-navy uppercase">Cartão de Crédito</p>
                    <p className="text-[9px] text-gray-400">Até 10x sem juros</p>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex items-center p-6 border-2 transition-all ${paymentMethod === 'pix' ? 'border-navy bg-white' : 'border-gray-100 bg-gray-50 opacity-60 hover:opacity-100'}`}
                >
                  <Landmark size={20} className="text-navy mr-4" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-navy uppercase">PIX</p>
                    <p className="text-[9px] text-gray-400">5% de Desconto</p>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`flex items-center p-6 border-2 transition-all ${paymentMethod === 'whatsapp' ? 'border-navy bg-white' : 'border-gray-100 bg-gray-50 opacity-60 hover:opacity-100'}`}
                >
                  <div className="w-5 h-5 mr-4 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-navy fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-navy uppercase">WhatsApp</p>
                    <p className="text-[9px] text-gray-400">Finalizar por mensagem</p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="mt-8 p-8 bg-gray-50 border border-gray-100 text-center space-y-4">
                  <div className="w-12 h-12 bg-navy/5 text-navy rounded-full flex items-center justify-center mx-auto mb-2">
                    <Lock size={20} />
                  </div>
                  <p className="text-[11px] text-navy font-bold uppercase tracking-widest">Cartão de Crédito Indisponível</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Esta forma de pagamento está temporariamente desabilitada por estarmos em fase de desenvolvimento.
                    <br /> Por favor, utilize a opção **WhatsApp** para finalizar seu pedido.
                  </p>
                  <button
                    onClick={() => setPaymentMethod('whatsapp')}
                    className="text-[10px] text-navy font-bold uppercase border-b border-navy/20 pb-1 hover:border-navy transition-all"
                  >
                    Mudar para WhatsApp
                  </button>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="mt-8 p-8 bg-gray-50 border border-gray-100 text-center space-y-4">
                  <div className="w-12 h-12 bg-navy/5 text-navy rounded-full flex items-center justify-center mx-auto mb-2">
                    <Lock size={20} />
                  </div>
                  <p className="text-[11px] text-navy font-bold uppercase tracking-widest">PIX Indisponível</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Esta forma de pagamento está temporariamente desabilitada por estarmos em fase de desenvolvimento.
                    <br /> Por favor, utilize a opção **WhatsApp** para finalizar seu pedido.
                  </p>
                  <button
                    onClick={() => setPaymentMethod('whatsapp')}
                    className="text-[10px] text-navy font-bold uppercase border-b border-navy/20 pb-1 hover:border-navy transition-all"
                  >
                    Mudar para WhatsApp
                  </button>
                </div>
              )}

              {paymentMethod === 'whatsapp' && (
                <div className="mt-8 p-6 bg-green-50 border border-green-100 text-center">
                  <p className="text-[11px] text-green-800 font-bold uppercase tracking-widest mb-2">Atendimento via WhatsApp</p>
                  <p className="text-xs text-green-700/70">Você será redirecionado para o nosso WhatsApp oficial para concluir seu pedido com atendimento personalizado.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-10 shadow-xl sticky top-40 border border-gray-100">
              <h4 className="text-[10px] tracking-[0.4em] uppercase font-bold text-navy mb-10 border-b border-gray-50 pb-4">Seu Pedido</h4>
              <div className="max-h-60 overflow-y-auto hide-scrollbar mb-8 space-y-4">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-xs items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-14 bg-gray-50 overflow-hidden mr-4">
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-navy uppercase tracking-tighter">{item.name}</p>
                        <p className="text-gray-400">Tamanho: {item.selectedSize} (x{item.quantity})</p>
                      </div>
                    </div>
                    <span className="text-navy">R$ {item.price.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-gray-50 mb-10">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-navy font-bold">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Entrega</span>
                  <span className="text-navy font-bold uppercase tracking-tighter">Cortesia</span>
                </div>
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-[10px] uppercase font-bold tracking-widest">
                    {error}
                  </div>
                )}
                <div className="flex justify-between text-xl font-serif text-navy pt-4">
                  <span className="italic">Total</span>
                  <span className="font-bold">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-navy text-white py-5 text-[11px] tracking-[0.3em] font-bold uppercase shadow-2xl hover:bg-navy/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Processando...' : paymentMethod === 'whatsapp' ? 'Finalizar via WhatsApp' : 'Finalizar pelo WhatsApp'}
              </button>
              <p className="text-center mt-6 text-[8px] text-gray-400 uppercase tracking-widest flex items-center justify-center">
                <ShieldCheck size={12} className="mr-2" /> Pagamento 100% Seguro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
