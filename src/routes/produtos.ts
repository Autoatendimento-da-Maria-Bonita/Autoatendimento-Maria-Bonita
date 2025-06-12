import express from 'express';
import { Request, Response, Router, RequestHandler } from 'express';
import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';

dotenv.config();

const produtosRouter = express.Router();

const supabase = createClient(
    "https://tvnuasxggudcegiclpzp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnVhc3hnZ3VkY2VnaWNscHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODYwNjgsImV4cCI6MjA1OTQ2MjA2OH0.0irQipVPIzSnsarcw6MJnmTcwKqnfuG_KkmHimV0poY",
    {
        auth: {
            persistSession: true
        }
    }
);

produtosRouter.get('/produtos/:categoria', (async (req: Request, res: Response) => {
  const { categoria } = req.params;

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('categoria', categoria);

  if (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return res.status(500).json({ error: 'Erro ao buscar produtos' });
  }

  res.json(data);
}) as RequestHandler);

export default produtosRouter;
