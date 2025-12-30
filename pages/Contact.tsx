
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Mensagem enviada com sucesso. Entraremos em contato em até 24h.');
  };

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h1 className="text-5xl font-serif text-navy mb-12 italic">Atendimento <br /> Exclusivo</h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed mb-16 max-w-md">
              Para consultas de sob medida, parcerias ou suporte, nossa equipe está à disposição para oferecer uma experiência personalizada.
            </p>
            
            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="bg-gray-50 p-4"><MapPin size={24} className="text-navy" /></div>
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] font-bold text-navy uppercase mb-2">Showroom Principal</h4>
                  <p className="text-sm text-gray-500">Av. Brigadeiro Faria Lima, 2000 - Itaim Bibi<br />São Paulo, Brasil</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="bg-gray-50 p-4"><Mail size={24} className="text-navy" /></div>
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] font-bold text-navy uppercase mb-2">E-mail Privado</h4>
                  <p className="text-sm text-gray-500">concierge@mendoncadreams.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="bg-gray-50 p-4"><Phone size={24} className="text-navy" /></div>
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] font-bold text-navy uppercase mb-2">Direct Line</h4>
                  <p className="text-sm text-gray-500">+55 (11) 99999-9999</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-12 lg:p-16">
            <h3 className="text-2xl font-serif text-navy mb-10">Envie uma Mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-3 block">Nome</label>
                  <input required type="text" className="w-full bg-white border-none py-4 px-6 text-sm focus:ring-1 focus:ring-navy transition-all" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-3 block">Assunto</label>
                  <input required type="text" className="w-full bg-white border-none py-4 px-6 text-sm focus:ring-1 focus:ring-navy transition-all" />
                </div>
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-3 block">Sua Mensagem</label>
                <textarea required rows={6} className="w-full bg-white border-none py-4 px-6 text-sm focus:ring-1 focus:ring-navy transition-all resize-none"></textarea>
              </div>
              <button className="bg-navy text-white px-12 py-5 text-[11px] tracking-[0.3em] font-bold uppercase flex items-center space-x-4 hover:bg-navy/90 transition-all shadow-xl">
                <span>Enviar Solicitação</span>
                <Send size={16} />
              </button>
              {status && <p className="text-sm text-green-600 font-medium italic mt-4">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
