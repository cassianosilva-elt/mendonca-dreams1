
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-20 pb-10 w-full">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif tracking-widest mb-1">MENDONÇA</h2>
            <p className="text-[10px] tracking-[0.4em] mb-6 opacity-60">DREAMS</p>
            <p className="text-sm font-light opacity-70 leading-relaxed mb-8">
              Cortes impecáveis, tecidos nobres e o compromisso com a excelência. Vestindo sonhos e construindo legados desde o primeiro corte.
            </p>
            <div className="flex space-x-4 opacity-70">
              <a href="https://www.instagram.com/mendoncadreams/" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} className="hover:opacity-100 cursor-pointer" />
              </a>
              <Mail size={20} className="hover:opacity-100 cursor-pointer" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-8 uppercase">Shopping</h4>
            <ul className="space-y-4 text-sm font-light opacity-70">
              <li><Link to="/novidades" className="hover:underline">Novidades</Link></li>
              <li><Link to="/mais-vendidos" className="hover:underline">Best Sellers</Link></li>
              <li><Link to="/colecoes" className="hover:underline">Coleções</Link></li>
              <li><Link to="/sustentabilidade" className="hover:underline">Sustentabilidade</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-8 uppercase">Suporte</h4>
            <ul className="space-y-4 text-sm font-light opacity-70">
              <li><Link to="/conta" className="hover:underline">Minha Conta</Link></li>
              <li><Link to="/envios-e-devolucoes" className="hover:underline">Envios e Devoluções</Link></li>
              <li><Link to="/guia-de-medidas" className="hover:underline">Guia de Medidas</Link></li>
              <li><Link to="/privacidade" className="hover:underline">Privacidade</Link></li>
              <li><Link to="/termos" className="hover:underline">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-8 uppercase">Membro Dreams</h4>
            <p className="text-sm font-light opacity-70 mb-6 leading-relaxed">
              Assine para receber acesso antecipado a novas coleções e convites para eventos exclusivos.
            </p>
            <div className="flex border-b border-white/20 pb-2">
              <input
                type="email"
                placeholder="E-mail"
                className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-white/40"
              />
              <button className="text-white hover:opacity-70 transition">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] tracking-widest opacity-40 uppercase">© 2025 Mendonça Dreams. Todos os direitos reservados.</p>
          <div className="flex space-x-8 text-[10px] tracking-widest opacity-40 uppercase">
            <span>Brasil</span>
            <span>Português</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
