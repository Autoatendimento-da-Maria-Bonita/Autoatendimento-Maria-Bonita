import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Teste de conexão (opcional)
conn.getConnection()
  .then(() => console.log('Conectado ao MySQL com sucesso!'))
  .catch((err: any) => console.error('Erro ao conectar ao MySQL:', err));

export default conn;
