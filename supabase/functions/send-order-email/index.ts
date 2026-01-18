/// <reference lib="deno.ns" />

// Note: In Supabase Edge Functions, several globals like Deno, fetch, and Request are available by default.
// The imports from deno.land are used for specific standard library utilities.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore: Deno namespace is defined in deno.d.ts
Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        console.log('Received request body:', JSON.stringify(body, null, 2))

        const { order } = body

        if (!order) {
            throw new Error('Order data is missing')
        }

        if (!RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set')
        }

        if (!order.items || !Array.isArray(order.items)) {
            throw new Error('Order items are missing or invalid')
        }

        const itemsHtml = order.items.map((item: any) => `
        <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee;">
                <p style="margin: 0; font-weight: bold; color: #002147; font-size: 14px; text-transform: uppercase;">${item.productName || 'Item'}</p>
                <p style="margin: 5px 0 0; color: #666666; font-size: 12px;">Tam: ${item.size || 'N/A'} | Cor: ${item.color || 'N/A'} | Qtd: ${item.quantity || 1}</p>
            </td>
            <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee; text-align: right; color: #002147; font-weight: bold;">
                R$ ${((item.price || 0) * (item.quantity || 1)).toLocaleString('pt-BR')}
            </td>
        </tr>
    `).join('');

        const orderIdShort = order.id ? order.id.split('-').pop() : 'N/A';
        const totalFormatted = typeof order.total === 'number' ? order.total.toLocaleString('pt-BR') : '0,00';

        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; padding-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #002147; text-transform: uppercase; text-decoration: none; }
            .content { background-color: #ffffff; }
            .order-status { text-align: center; margin-bottom: 40px; }
            .status-badge { display: inline-block; padding: 8px 16px; background-color: #002147; color: #ffffff; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
            .greeting { font-size: 18px; color: #002147; margin-bottom: 20px; }
            .order-details { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .total-section { padding-top: 20px; border-top: 2px solid #002147; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .total-label { font-weight: bold; color: #002147; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
            .total-value { font-size: 20px; font-weight: bold; color: #002147; }
            .address-box { background-color: #f9f9f9; padding: 20px; margin-bottom: 30px; border-left: 4px solid #002147; }
            .address-title { font-weight: bold; color: #002147; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; margin-bottom: 10px; display: block; }
            .footer { text-align: center; padding-top: 40px; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px; }
            .whatsapp-note { background-color: #f0fdf4; border: 1px solid #dcfce7; color: #166534; padding: 15px; font-size: 13px; text-align: center; margin-bottom: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="https://mendonca-dreams.com" class="logo">Mendonça Dreams</a>
            </div>
            
            <div class="content">
                <div class="order-status">
                    <span class="status-badge">Pedido Recebido</span>
                    <h1 style="font-family: serif; font-style: italic; color: #002147; margin-top: 20px;">Confirmamos seu pedido em nosso ateliê</h1>
                </div>

                <p class="greeting">Olá, ${order.userName || 'Cliente'},</p>
                <p>É um prazer informar que seu pedido <strong>#${orderIdShort}</strong> foi recebido com sucesso. Cada peça da Mendonça Dreams é confeccionada com o rigor da alta alfaiataria e agora iniciamos o processo de preparação do seu pedido.</p>

                <div class="whatsapp-note">
                    <strong>Próximo Passo:</strong> Como optado pela finalização via WhatsApp, nossa equipe entrará em contato em breve para confirmar os detalhes de pagamento e entrega.
                </div>

                <table class="order-details">
                    <thead>
                        <tr>
                            <th style="text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #999999; padding-bottom: 15px;">Item</th>
                            <th style="text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #999999; padding-bottom: 15px;">Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="total-section" style="margin-bottom: 40px;">
                    <div style="text-align: right;">
                        <span class="total-label">Total do Pedido</span>
                        <div class="total-value">R$ ${totalFormatted}</div>
                    </div>
                </div>

                <div class="address-box">
                    <span class="address-title">Endereço de Entrega</span>
                    <p style="margin: 0; font-size: 14px; color: #666666;">
                        ${order.shippingAddress?.street || 'N/A'}, ${order.shippingAddress?.number || ''}${order.shippingAddress?.complement ? ` - ${order.shippingAddress.complement}` : ''}<br>
                        ${order.shippingAddress?.neighborhood || ''}<br>
                        ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.state || ''}<br>
                        CEP: ${order.shippingAddress?.zipCode || ''}
                    </p>
                </div>

                <p style="font-size: 13px; color: #666666; text-align: center; margin-top: 40px;">
                    Se tiver qualquer dúvida, sinta-se à vontade para nos chamar no WhatsApp ou responder a este e-mail.
                </p>
            </div>

            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Mendonça Dreams. Todos os direitos reservados.</p>
                <p>Moda Feminina</p>
            </div>
        </div>
    </body>
    </html>
    `;

        console.log('Sending email to:', order.userEmail)
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Mendonça Dreams <mouracassiano410@gmail.com>',
                to: [order.userEmail],
                subject: `Pedido Recebido | Mendonça Dreams #${orderIdShort}`,
                html: htmlContent,
            }),
        })

        const resText = await res.text()
        console.log('Resend response:', resText)

        let data
        try {
            data = JSON.parse(resText)
        } catch (e) {
            data = { message: resText }
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: res.status,
        })
    } catch (error: any) {
        console.error('Function error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }

})
