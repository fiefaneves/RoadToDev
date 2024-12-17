import openai from "../config/open-ai.js"; // Importa o cliente da API OpenAI

async function generate(queryDescription) {
    // Verificação para garantir que queryDescription não seja vazio ou nulo
    if (!queryDescription || queryDescription.trim() === "") {
        throw new Error("Descrição da consulta não pode ser vazia.");
    }

    const messages = []; // Cria um array de mensagens
    messages.push({ role: 'user', content: queryDescription }); // Adiciona a mensagem do usuário ao array

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        }); // Cria uma conversa

        const completionText = response.choices[0].message.content; // Obtém o texto gerado
        messages.push({ role: 'assistant', content: completionText }); // Adiciona a mensagem do assistente ao array
        return completionText; // Retorna o texto gerado

    } catch (error) {
        console.error('Erro na API OpenAI:', error.response?.data || error.message);
        throw new Error('Erro ao gerar o roadmap.');
    }
}

export default generate; // Exporta a função de geração de texto
