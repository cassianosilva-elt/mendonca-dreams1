
import React from 'react';

const Shipping = () => {
    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <header className="mb-20 text-center">
                    <h1 className="text-5xl font-serif text-navy mb-6 italic">Envios e Devoluções</h1>
                    <p className="text-gray-400 font-light max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
                        Informações sobre entregas, prazos e nossa política de trocas.
                    </p>
                </header>

                <div className="max-w-3xl mx-auto space-y-12">
                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Envios</h2>
                        <p className="text-gray-600 font-light leading-relaxed mb-4">
                            Realizamos entregas em todo o Brasil. O prazo de entrega varia de acordo com a região e o método de envio selecionado no momento da compra.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 font-light space-y-2">
                            <li>Frete Grátis em compras acima de R$ 2.000,00</li>
                            <li>Envio em até 3 dias úteis após a confirmação do pagamento</li>
                            <li>Rastreamento disponível via e-mail</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Devoluções e Trocas</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Você tem até 7 dias corridos após o recebimento para solicitar a devolução ou troca da sua peça, desde que ela esteja na embalagem original, sem sinais de uso e com todas as etiquetas fixadas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Processo de Estorno</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            O estorno será realizado no mesmo método de pagamento utilizado na compra em até 10 dias úteis após o recebimento e conferência da peça devolvida em nosso centro de distribuição.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
