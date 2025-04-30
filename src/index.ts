import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/tela_inicial.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/tela_inicial.html'));
});

app.get('/tela_compras.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/tela_compras.html'));
});

app.get('/tela_pagamento.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/tela_pagamento.html'));
});

// Exemplo de rota que usa o Supabase
app.get('/api/test', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sua_tabela')
            .select('*');
            
        if (error) throw error;
        res.json(data);
    } 
    catch (error) {
        res.status(500).json({ error: 'Erro ao acessar o banco de dados' });
    }
});

// Inserir dados
app.post('/api/inserir', async (req, res) => {
    const { nome, valor } = req.body;
    try {
        const { data, error } = await supabase
            .from('sua_tabela')
            .insert([{ nome, valor }]);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir dados' });
    }
});

// Buscar dados
app.get('/api/buscar', async (req, res) => {
    const coluna = req.query.coluna as string;
    const valor = req.query.valor as string;
    try {
        const { data, error } = await supabase
            .from('sua_tabela')
            .select('*')
            .eq(coluna, valor);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

// Atualizar dados
app.put('/api/atualizar', async (req, res) => {
    const { id, nome } = req.body;
    try {
        const { data, error } = await supabase
            .from('sua_tabela')
            .update({ nome })
            .eq('id', id);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar dados' });
    }
});

// Deletar dados
app.delete('/api/deletar', async (req, res) => {
    const { id } = req.query;
    try {
        const { data, error } = await supabase
            .from('sua_tabela')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar dados' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})