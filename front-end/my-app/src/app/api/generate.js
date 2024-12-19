import express from 'express';
import generate from './controllers/generative.js'; // Importa a função de geração

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { queryDescription } = req.body; // Acessando a queryDescription do corpo da requisição

    // Verificando se a queryDescription está vazia ou inválida
    if (!queryDescription || queryDescription.trim() === "") {
        return res.status(400).json({ error: "Descrição da consulta não pode ser vazia." });
    }

    try {
        // Chama sua função de geração aqui
        const result = await generate(queryDescription);

        // Envia a resposta
        res.json({ roadmap: result });
    } catch (error) {
        console.error("Erro ao gerar roadmap:", error);
        res.status(500).json({ error: 'Erro ao gerar o roadmap.' });
    }
});

export default router;
