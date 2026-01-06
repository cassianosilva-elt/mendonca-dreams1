import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGenderedLanguage } from '../hooks/useGenderedLanguage';

const GiftSection: React.FC = () => {
    const { translate } = useGenderedLanguage();
    const giftIdeas = [
        {
            icon: <Sparkles size={24} />,
            title: 'Acessórios',
            description: 'Elegância em cada detalhe',
            price: 'A partir de R$ 199',
        },
        {
            icon: <Heart size={24} />,
            title: 'Vestidos',
            description: 'Para ocasiões especiais',
            price: 'A partir de R$ 599',
        },
        {
            icon: <Gift size={24} />,
            title: 'Vale-Presente',
            description: `Deixe ${translate('she')} escolher`,
            price: 'Valores flexíveis',
        },
    ];

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-rose-50/50 to-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-rose-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-navy/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-navy text-white rounded-full mb-6">
                        <Gift size={28} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
                        Presentes <span className="italic">Perfeitos</span>
                    </h2>
                    <p className="text-gray-500 font-light max-w-2xl mx-auto text-lg">
                        Surpreenda quem você ama com uma peça especial da Mendonça Dreams.
                        Selecionamos as melhores opções para presentear.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {giftIdeas.map((idea, index) => (
                        <motion.div
                            key={idea.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-navy/5 text-navy rounded-full flex items-center justify-center mb-6 group-hover:bg-navy group-hover:text-white transition-all duration-300">
                                {idea.icon}
                            </div>
                            <h3 className="text-xl font-serif text-navy mb-2">{idea.title}</h3>
                            <p className="text-gray-500 font-light text-sm mb-4">{idea.description}</p>
                            <p className="text-[10px] uppercase tracking-widest text-navy/60 font-bold">{idea.price}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center space-y-6"
                >
                    <Link
                        to="/presentes"
                        className="inline-flex items-center gap-4 bg-navy text-white px-10 py-5 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all shadow-xl group"
                    >
                        Ver Sugestões de Presentes
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="text-sm text-gray-400">
                        <Link to="/guia-de-medidas" className="text-navy hover:underline">
                            Não sabe o tamanho? Veja nossas dicas →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default GiftSection;
