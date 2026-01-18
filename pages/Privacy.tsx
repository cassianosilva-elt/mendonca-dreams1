
import React from 'react';

const Privacy = () => {
    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <header className="mb-20 text-center">
                    <h1 className="text-5xl font-serif text-navy mb-6 italic">Privacidade</h1>
                    <p className="text-gray-400 font-light max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
                        Sua privacidade e segurança são nossa prioridade.
                    </p>
                </header>

                <div className="max-w-3xl mx-auto space-y-12">
                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Coleta de Informações</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Coletamos informações essenciais para processar seus pedidos e proporcionar uma experiência personalizada, como seu nome, e-mail, endereço e dados de pagamento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Uso de Dados</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Seus dados são utilizados exclusivamente para o processamento de compras, entrega de produtos e, caso você autorize, envio de novidades e promoções exclusivas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Segurança</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Utilizamos tecnologias avançadas de criptografia para garantir que suas informações estejam sempre protegidas contra acessos não autorizados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-navy mb-4">Seus Direitos</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais a qualquer momento através da sua conta ou entrando em contato com nosso suporte.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
