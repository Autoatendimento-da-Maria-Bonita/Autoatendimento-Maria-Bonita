import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadRouter: Router = Router();

// Diretório base onde as imagens serão armazenadas
const baseImagePath = path.join(__dirname, "../../public/img");

// Cria diretório base se não existir
if (!fs.existsSync(baseImagePath)) {
    fs.mkdirSync(baseImagePath, { recursive: true });
}

// Diretório temporário para upload inicial
const tempDir = path.join(baseImagePath, "__temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configuração do Multer: salva primeiro em temp
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).fields([
    { name: "imagem", maxCount: 1 },
    { name: "categoria", maxCount: 1 },
]);

// Função para sanitizar o nome da categoria
function sanitizeCategoria(str: string): string {
    return str.replace(/[^a-zA-Z0-9_-]/g, "");
}
uploadRouter.post("/", (req: Request, res: Response) => {
    upload(req, res, function (err) {
        if (err) {
            console.error("Erro no upload:", err);
            return res.status(400).json({ error: "Erro no upload: " + err.message });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const file = files?.["imagem"]?.[0];

        console.log("REQ.BODY:", req.body);
        console.log("FILES:", files);

        if (!file) {
            console.error("Arquivo não encontrado");
            return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
        }

        const categoriaRaw = req.body.categoria;
        if (!categoriaRaw) {
            console.error("Categoria não enviada!");
            return res.status(400).json({ error: "Categoria não enviada no formulário" });
        }

        const categoria = sanitizeCategoria(categoriaRaw);
        const finalDir = path.join(baseImagePath, categoria);

        try {
            if (!fs.existsSync(finalDir)) {
                fs.mkdirSync(finalDir, { recursive: true });
                console.log("Criada pasta:", finalDir);
            }

            const finalPath = path.join(finalDir, file.filename);
            console.log("Movendo de:", file.path);
            console.log("Para:", finalPath);

            fs.renameSync(file.path, finalPath);

            const imageUrl = `/img/${categoria}/${file.filename}`;
            console.log("Success - Image URL:", imageUrl);

            res.json({ imageUrl });
        } catch (error) {
            console.error("Erro ao mover imagem:", error);
            res.status(500).json({ error: "Erro interno ao processar imagem" });
        }
        console.log("REQ.BODY:", req.body); 
    });
});

export default uploadRouter;
