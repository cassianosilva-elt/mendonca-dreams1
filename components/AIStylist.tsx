
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, X, MessageSquare, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStylingAdvice } from '../services/gemini';
import { ChatMessage } from '../types';
import { useGenderedLanguage } from '../hooks/useGenderedLanguage';
import OptimizedImage from './OptimizedImage';

const AIStylist: React.FC = () => {
  const { user } = useAuth();
  const { translate } = useGenderedLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `${translate('welcome')} à Mendonça Dreams. Sou su${translate('she') === 'ela' ? 'a' : 'eu'} ${translate('stylist')} pessoal. Como posso elevar seu visual hoje?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const newUserMessage: ChatMessage = { role: 'user', text: userText };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await getStylingAdvice(userText, [...messages, newUserMessage], user || undefined);

      const modelMessage: ChatMessage = { role: 'model', text: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error getting styling advice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed z-[100] transition-all duration-500 ${isOpen ? 'inset-0 md:inset-auto md:bottom-8 md:right-8' : 'bottom-8 right-8'}`}>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-navy text-white p-4 md:p-5 rounded-full shadow-[0_20px_50px_rgba(0,33,71,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/10"
        >
          <div className="flex items-center space-x-3">
            <MessageSquare size={22} />
            <span className="hidden md:block text-[11px] font-bold tracking-[0.2em] uppercase pr-2">Está em Duvida?</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-full h-full md:w-[400px] md:h-[600px] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slideUp">
          {/* Header */}
          <div className="bg-navy p-6 md:p-8 text-white flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MessageSquare size={18} className="text-white/80" />
              </div>
              <div>
                <h3 className="font-serif text-lg md:text-xl tracking-wide">Concierge Dreams</h3>
                <p className="text-[9px] tracking-[0.3em] opacity-50 uppercase">Inteligência de Estilo</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${msg.role === 'user'
                  ? 'bg-navy text-white rounded-tr-none'
                  : 'bg-white text-navy border border-gray-100 rounded-tl-none font-medium'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-gray-100 flex space-x-2 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-navy/20 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-navy/20 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-navy/20 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 md:p-8 bg-white border-t border-gray-100">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Como posso elevar meu look hoje?"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-1 focus:ring-navy/20 focus:bg-white transition-all placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-navy text-white p-2.5 rounded-xl hover:bg-navy/90 transition-all disabled:opacity-30 shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[9px] text-gray-400 text-center mt-5 uppercase tracking-[0.2em] font-medium italic">Sua presença, nossa prioridade.</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default AIStylist;
