import { Router } from 'express';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import dotenv from 'dotenv';
import * as ngrok from '@ngrok/ngrok';

dotenv.config();

const pagamentoRouter = Router();

// Instancia configurada com o token
const mercadopago = new MercadoPagoConfig({
  accessToken: 'TEST-3466060941197780-050808-925adfb90d6f8e3db78f1f00a43f7284-2200633020',
});

// Instancia o cliente de preferências
const preferenceClient = new Preference(mercadopago);

pagamentoRouter.post('/criar-preferencia', async (req, res) => {
  try {
    const cart = req.body.cart;

    // Converte os itens do carrinho para o formato exigido pelo Mercado Pago
    const items = Object.entries(cart).map(([productName, details]: any) => ({
      id: productName,
      title: productName,
      quantity: Number(details.quantity),
      currency_id: 'BRL',
      unit_price: parseFloat(details.price),
    }));

    // Inicia o ngrok para obter a URL externa
    const ngrokUrl = await ngrok.connect({ addr: 3000 });
    console.log('Ngrok URL:', ngrokUrl); // Mostra a URL do ngrok

    // Cria a preferência no Mercado Pago com as URLs dinâmicas
    const preference = await preferenceClient.create({
      body: {
        items,
        payment_methods: {
          excluded_payment_types: [{ id: "credit_card" }, { id: "ticket" }],
          default_payment_method_id: "pix",
        },
        back_urls: {
          success: `${ngrokUrl}/pagamento/sucesso`,
          failure: `${ngrokUrl}/pagamento/erro`,
          pending: `${ngrokUrl}/pagamento/pendente`,
        },
        auto_return: 'approved',
      },
    });

    // Retorna a ID da preferência criada
    res.json({ id: preference.id });
  } catch (err) {
    console.error("Erro ao criar preferência:", err);
    res.status(500).json({ error: 'Erro ao criar preferência' });
  }
});

export default pagamentoRouter;
