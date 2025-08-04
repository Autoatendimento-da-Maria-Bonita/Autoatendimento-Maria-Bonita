import { Router, Request, Response, RequestHandler } from 'express';
import pool from '../db/connection';

const usersRouter = Router();

usersRouter.post('/login', (async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute<any[]>(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, usuario: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
}) as RequestHandler);


usersRouter.post('/auth', (async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const [rows] = await pool.execute<any[]>("SELECT * FROM users WHERE username = ?", [username]);
    
    if (rows.length > 0) {
      return res.json({ success: true, usuario: rows[0] });
    }
    else {
      res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
    }
  } 
  catch (err) {
    console.error('Erro na autenticação:', err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
}) as RequestHandler);

export default usersRouter;
