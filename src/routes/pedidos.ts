import express, {Request, Response, Router} from 'express';
import pool from '../db/connection';

const pedidosRouter = Router();

pedidosRouter.get("/", async(req: Request, res: Response) => {
    try{
        const [rows] = await pool.execute("SELECT * FROM pedidos WHERE finalizado = 0 ORDER BY id ASC");
        res.json(rows);
    }
    catch(error){
        res.status(500).json({error: "Erro ao buscar os pedidos"})
    }
});

pedidosRouter.get("/total", async(req: Request, res: Response) => {
    try{
        const [rows] = await pool.execute("SELECT SUM(valor) as valor_total, COUNT(*) as total_pedidos FROM pedidos WHERE finalizado = 1");
        res.status(200).json(rows);
    }
    catch(error){
        res.status(500).json({error: "Erro ao buscar o total de pedidos"});
    }
});

pedidosRouter.put("/:id", async(req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const [result] = await pool.execute("UPDATE pedidos SET finalizado = 1 WHERE id = ?", [id]);
        res.status(204).send();
    } 
    catch (error) {
        res.status(500).json({error: "Erro ao finalizar pedido"});
    }
});

export default pedidosRouter;