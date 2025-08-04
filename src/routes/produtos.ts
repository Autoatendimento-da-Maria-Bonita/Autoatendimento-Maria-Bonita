import express, { Request, Response, Router, RequestHandler } from 'express';
import pool from '../db/connection';
import path from "path";
import fs from "fs";

const produtosRouter = Router();

// GET
produtosRouter.get("/produtos", (async (req: Request, res: Response) => {
	try{
		const [rows] = await pool.execute("SELECT * FROM produtos")
		res.json(rows)
	}
	catch(error){
		res.status(500).json({error: "Erro ao buscar produtos"})
	}
}));


// GET produto por ID
produtosRouter.get("/produtos/id/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.execute(
			"SELECT * FROM produtos WHERE id = ?",
			[id]
		);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar produto por ID" });
	}
});

// GET produtos por categoria
produtosRouter.get("/produtos/categoria/:categoria", async (req: Request, res: Response) => {
	const { categoria } = req.params;
	try {
		const [rows] = await pool.execute(
			"SELECT * FROM produtos WHERE categoria = ?",
			[categoria]
		);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar produtos por categoria" });
	}
});




// POST
produtosRouter.post("/produtos", async (req: Request, res: Response) => {
	const {nome, preco, categoria, imagem_url, quantidade_estoque} = req.body;
	try{
		const [result] = await pool.execute(
			`INSERT INTO produtos (nome, preco, categoria, imagem_url, quantidade_estoque)
			VALUES (?, ?, ?, ?, ?)`,
			[nome, preco, categoria, imagem_url, quantidade_estoque]
		);

		res.status(201).json({ message: "Produto cadastrado com sucesso",});
	}
	catch (error){
		res.status(500).json({ error: 'Erro ao cadastrar produto' });
	}
});


produtosRouter.put("/produtos/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const { nome, preco, categoria, quantidade_estoque, imagem_url,} = req.body;

	try {
		const [result] = await pool.execute(`UPDATE produtos 
			SET nome = ?, preco = ?, categoria = ?, quantidade_estoque = ?
			WHERE id = ?`,
			[nome, preco, categoria, quantidade_estoque, id]
		);

		res.status(200).json({ message: "Produto atualizado com sucesso" });
	} 
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro ao atualizar produto' });
	}
});



// DELETE
produtosRouter.delete("/produtos/:id", (req: Request, res: Response) => {
	const { id } = req.params;

	(async () => {
		try {
			// Buscar imagem_url do banco
			const [rows]: any = await pool.execute("SELECT imagem_url FROM produtos WHERE id = ?", [id]);
			if (!rows.length) return res.status(404).json({ error: "Produto não encontrado" });

			const imagemUrl = rows[0].imagem_url;
			const imagePath = path.join(__dirname, "../../public", imagemUrl);

			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
				console.log("Imagem deletada:", imagePath);
			}

			await pool.execute("DELETE FROM produtos WHERE id = ?", [id]);

			return res.status(200).json({ message: "Produto e imagem deletados com sucesso!" });

		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erro ao deletar produto" });
		}
	})();
});

export default produtosRouter;