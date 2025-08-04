import cors            from 'cors';
import path            from 'path';
import dotenv          from 'dotenv';
import express         from 'express';
import usersRoutes     from './routes/users';
import uploadRoutes    from './routes/upload';
import pedidosRouter   from './routes/pedidos';
import produtosRoutes  from './routes/produtos';
import pagamentoRouter from './routes/pagamento';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', produtosRoutes);
app.use('/user', usersRoutes);
app.use('/upload', uploadRoutes);
app.use('/pedidos', pedidosRouter)
app.use('/pagamento', pagamentoRouter);
app.use(express.static(path.join(process.cwd(), 'public')));

// Rotas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/login.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/index.html'));
});

app.get('/tela_inicial', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/tela_inicial.html'));
});

app.get('/tela_compras', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/tela_compras.html'));
});

app.get('/tela_pagamento', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/tela_pagamento.html'));
});

app.get('/tela_pedidos', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/tela_pedidos.html'));
});

app.get('/cadastro_produtos', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/cadastro_produtos.html'));
});

app.get('/gerenciamento_produtos', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/html/gerenciamento_produtos.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});