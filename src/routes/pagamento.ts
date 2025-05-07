import { Router } from 'express';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const pagamentoRouter = Router();

// Instancia configurada com o token
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

// Instancia o cliente de preferências
const preferenceClient = new Preference(mercadopago);

pagamentoRouter.post('/criar-preferencia', async (req, res) => {
  try {
    const cart = req.body.cart;

    const items = Object.entries(cart).map(([productName, details]: any) => ({
        id: productName,
        title: productName,
        quantity: Number(details.quantity),
        currency_id: 'BRL',
        unit_price: parseFloat(details.price),
      }));

    const preference = await preferenceClient.create({
      body: {
        items,
        back_urls: {
          success: 'http://localhost:3000/sucesso.html',
          failure: 'http://localhost:3000/erro.html',
          pending: 'http://localhost:3000/pendente.html',
        },
        auto_return: 'approved',
      },
    });

    res.json({ id: preference.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar preferência');
  }
});

export default pagamentoRouter;
