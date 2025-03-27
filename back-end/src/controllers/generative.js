import openai from "../config/open-ai.js";

async function generate(queryDescription) {
    if (!queryDescription || queryDescription.trim() === "") {
        throw new Error("Descrição da consulta não pode ser vazia.");
    }

    const messages = [];
    messages.push({ role: 'user', content: queryDescription });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        const completionText = response.choices[0].message.content;
        messages.push({ role: 'assistant', content: completionText });
        return completionText;

    } catch (error) {
        console.error('Erro na API OpenAI:', error.response?.data || error.message);
        throw new Error('Erro ao gerar o roadmap.');
    }
}

export default generate;
