import express from 'express';
import generate from './controllers/generative.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { queryDescription } = req.body;

    if (!queryDescription || queryDescription.trim() === "") {
        return res.status(400).json({ error: "Descrição da consulta não pode ser vazia." });
    }

    try {
        const result = await generate(queryDescription);

        res.json({ roadmap: result });
    } catch (error) {
        console.error("Erro ao gerar roadmap:", error);
        res.status(500).json({ error: 'Erro ao gerar o roadmap.' });
    }
});

export default router;
