import express, { Express, Request, Response } from 'express';
import uploadRouter from './routes/upload';
import produtosRouter from './routes/produtos';
import path from 'path';
import cors from 'cors';

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Usa a rota de upload
app.use('/upload', uploadRouter);
app.use('/api', produtosRouter);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

app.get('/index', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/tela_inicial', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/tela_inicial.html'));
});

app.get('/tela_compras', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/tela_compras.html'));
});

app.get('/tela_pagamento', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/tela_pagamento.html'));
});

app.get('/produtos_service', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/produtos_service.html'));
});

app.get('/gerenciamento_produtos', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/gerenciamento_produtos.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})