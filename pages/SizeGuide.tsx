
import React from 'react';

const SizeGuide = () => {
    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <header className="mb-20 text-center">
                    <h1 className="text-5xl font-serif text-navy mb-6 italic">Guia de Medidas</h1>
                    <p className="text-gray-400 font-light max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
                        Encontre o caimento perfeito para sua peça Mendonça Dreams.
                    </p>
                </header>

                <div className="max-w-4xl mx-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 font-serif text-navy uppercase tracking-widest text-sm">Tamanho</th>
                                    <th className="py-4 font-serif text-navy uppercase tracking-widest text-sm">Busto (cm)</th>
                                    <th className="py-4 font-serif text-navy uppercase tracking-widest text-sm">Cintura (cm)</th>
                                    <th className="py-4 font-serif text-navy uppercase tracking-widest text-sm">Quadril (cm)</th>
                                </tr>
                            </thead>
                            <tbody className="font-light text-gray-600">
                                <tr className="border-b border-gray-100">
                                    <td className="py-4">PP (34/36)</td>
                                    <td className="py-4">82-86</td>
                                    <td className="py-4">62-66</td>
                                    <td className="py-4">88-92</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4">P (38)</td>
                                    <td className="py-4">86-90</td>
                                    <td className="py-4">66-70</td>
                                    <td className="py-4">92-96</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4">M (40)</td>
                                    <td className="py-4">90-94</td>
                                    <td className="py-4">70-74</td>
                                    <td className="py-4">96-100</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4">G (42)</td>
                                    <td className="py-4">94-98</td>
                                    <td className="py-4">74-78</td>
                                    <td className="py-4">100-104</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="font-serif text-navy mb-4">Busto</h3>
                            <p className="text-gray-600 font-light text-sm">Meça em volta da parte mais saliente do seu busto, mantendo a fita métrica paralela ao chão.</p>
                        </div>
                        <div>
                            <h3 className="font-serif text-navy mb-4">Cintura</h3>
                            <p className="text-gray-600 font-light text-sm">Meça em volta da sua cintura natural (a parte mais estreita do tronco).</p>
                        </div>
                        <div>
                            <h3 className="font-serif text-navy mb-4">Quadril</h3>
                            <p className="text-gray-600 font-light text-sm">Meça em volta da parte mais larga dos seus quadris, cerca de 20cm abaixo da cintura.</p>
                        </div>
                    </div>

                    <div className="mt-20 pt-12 border-t border-gray-100">
                        <h2 className="text-3xl font-serif text-navy mb-8 italic">Comprando para Presentear?</h2>
                        <div className="bg-rose-50/50 p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-4">Dicas de Tamanho</h4>
                                    <ul className="space-y-4 text-gray-600 font-light text-sm">
                                        <li className="flex gap-4">
                                            <span className="text-navy font-bold">01.</span>
                                            <span>Verifique as etiquetas das peças favoritas dela (procure por marcas de alfaiataria similar).</span>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-navy font-bold">02.</span>
                                            <span>Em caso de dúvida entre dois tamanhos, escolha o maior para maior conforto no ajuste.</span>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-navy font-bold">03.</span>
                                            <span>Nossas peças possuem margens de costura internas que permitem pequenos ajustes por um costureiro.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy mb-4">Facilidades</h4>
                                    <ul className="space-y-4 text-gray-600 font-light text-sm">
                                        <li className="flex gap-4">
                                            <span className="text-navy font-bold font-serif italic">Troca Facilitada:</span>
                                            <span>A primeira troca é por nossa conta e pode ser solicitada em até 7 dias.</span>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-navy font-bold font-serif italic">Atendimento VIP:</span>
                                            <span>Fale com nossos estilistas via WhatsApp para ajuda personalizada na escolha.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeGuide;
