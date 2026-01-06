import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const EmailConfirmed: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white relative overflow-hidden">
            <SEO
                title="Email Confirmado | Mendonça Dreams"
                description="Sua conta foi confirmada com sucesso. Bem-vinda à Mendonça Dreams."
            />

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-navy/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-navy/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="relative inline-block mb-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={isLoaded ? { scale: 1 } : {}}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
                            className="bg-navy rounded-full p-8 relative z-10 shadow-2xl shadow-navy/20"
                        >
                            <CheckCircle size={48} className="text-white" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 scale-150 text-navy/10 pointer-events-none"
                        >
                            <Sparkles size={120} />
                        </motion.div>
                    </div>

                    <span className="text-navy/40 text-[10px] tracking-[0.5em] uppercase mb-6 block font-semibold">Sucesso</span>

                    <h1 className="text-4xl md:text-6xl font-serif text-navy mb-8 leading-tight">
                        Seja bem-vinda de <span className="italic">Corpo e Alma</span>.
                    </h1>

                    <p className="text-gray-500 text-lg font-light leading-relaxed mb-12 max-w-lg mx-auto">
                        Seu e-mail foi confirmado com sucesso. Agora você faz parte do universo exclusivo Mendonça Dreams, onde a elegância encontra o seu propósito.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-12 py-4 bg-navy text-white text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-navy/90 transition-all duration-300 shadow-xl shadow-navy/10 flex items-center justify-center group"
                        >
                            ACESSAR MINHA CONTA
                            <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/colecoes"
                            className="text-navy font-bold tracking-[0.2em] text-[10px] uppercase border-b border-navy/20 pb-2 hover:border-navy transition-colors"
                        >
                            EXPLORAR NOVIDADES
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailConfirmed;
