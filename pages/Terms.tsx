import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-40 pb-40 bg-white">
            <SEO title="Termos de Uso" />
            <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                <h1 className="text-5xl font-serif text-navy mb-12 italic">Termos de Uso</h1>

                <div className="prose prose-navy max-w-none text-gray-500 font-light leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-navy uppercase tracking-widest mb-4">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar e utilizar o site Mendonça Dreams, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy uppercase tracking-widest mb-4">2. Uso do Site</h2>
                        <p>
                            O conteúdo deste site é para sua informação geral e uso pessoal apenas. Ele está sujeito a alterações sem aviso prévio. A Mendonça Dreams se reserva o direito de recusar serviço, encerrar contas ou cancelar pedidos a seu exclusivo critério.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy uppercase tracking-widest mb-4">3. Propriedade Intelectual</h2>
                        <p>
                            Este site contém material que é de nossa propriedade ou licenciado para nós. Este material inclui, mas não se limita ao, design, layout, aparência e gráficos. A reprodução é proibida, exceto de acordo com o aviso de direitos autorais, que faz parte destes termos e condições.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy uppercase tracking-widest mb-4">4. Descrição de Produtos</h2>
                        <p>
                            Dedicamos o máximo de cuidado na descrição e exibição dos nossos produtos. No entanto, não garantimos que as descrições dos produtos ou outro conteúdo deste site sejam exatos, completos, confiáveis, atuais ou livres de erros. As cores podem variar dependendo do seu monitor.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy uppercase tracking-widest mb-4">5. Preços e Pagamentos</h2>
                        <p>
                            Todos os preços estão em Reais (BRL). Reservamo-nos o direito de alterar os preços a qualquer momento. Os pagamentos são processados através de parceiros seguros ou via atendimento personalizado por WhatsApp, conforme indicado no checkout.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-navy uppercase tracking-widest mb-4">6. Limitação de Responsabilidade</h2>
                        <p>
                            Sua utilização de qualquer informação ou material neste site é inteiramente por sua própria conta e risco, pela qual não seremos responsáveis. Será sua própria responsabilidade garantir que quaisquer produtos, serviços ou informações disponíveis através deste site atendam às suas necessidades específicas.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
