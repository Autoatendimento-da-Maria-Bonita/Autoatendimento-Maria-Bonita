import express, { Express, Request, Response } from 'express';
import serverless from 'serverless-http';
import pagamentoRoute from './routes/pagamento'; 
import uploadRouter from '../src/routes/upload';
import produtosRouter from '../src/routes/produtos';
import path from 'path';
import cors from 'cors';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Rotas API
app.use('/pagamento', pagamentoRoute);
app.use('/upload', uploadRouter);
app.use('/api', produtosRouter);

// Rotas HTML
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/html/login.html'));
});

app.get('/index', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/html/index.html'));
});

app.get('/tela_inicial', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/html/tela_inicial.html'));
});

app.get('/tela_compras', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/html/tela_compras.html'));
});

app.get('/tela_pagamento', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/html/tela_pagamento.html'));
});

app.get('/produtos_service', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/html/produtos_service.html'));
});

app.get('/gerenciamento_produtos', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public/html/gerenciamento_produtos.html'));
});

// Exporta como função Serverless para Vercel
module.exports = serverless(app);
