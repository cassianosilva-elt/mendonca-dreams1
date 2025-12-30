
import React from 'react';

const Sustainability = () => {
    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <header className="mb-20 text-center">
                    <h1 className="text-5xl font-serif text-navy mb-6 italic">Sustentabilidade</h1>
                    <p className="text-gray-400 font-light max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
                        Nosso compromisso com o futuro da moda.
                    </p>
                </header>

                <div className="max-w-3xl mx-auto space-y-12">
                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Slow Fashion</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Na Mendonça Dreams, acreditamos que a verdadeira elegância é atemporal. Nossas peças são desenhadas para durar gerações, combatendo a cultura do descarte e promovendo um consumo consciente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Produção Local</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Valorizamos a mão de obra local e processos artesanais. Toda a nossa produção é realizada em pequenos ateliês, onde cada detalhe é cuidado com respeito e dignidade.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Materiais Nobres</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Selecionamos apenas tecidos de alta qualidade e fibras naturais que possuem menor impacto ambiental e maior durabilidade.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Sustainability;
