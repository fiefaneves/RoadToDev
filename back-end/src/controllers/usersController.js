import openai from '../config/open-ai.js'; // Importa o pacote openai
import readlineSync from 'readline-sync'; // Importa o pacote readline-sync
import colors from 'colors'; // Importa o pacote colors

async function ChatBot() {
    console.log(colors.bold.green('Welcome to the ChatBot Program')); // Exibe uma mensagem de boas-vindas
    console.log(colors.bold.green('You can start chatting with the bot')); 

    const chatHistory = []; // Inicializa um array para armazenar o histórico de conversas

    while(true){
        const userInput = readlineSync.question(colors.yellow('You: ')); // Lê a mensagem do usuário
        try {
            // Mapeia as mensagens do histórico                                                                
            const messages = chatHistory.map(([role, content]) => ({role, content})); 
            // Adiciona a mensagem do usuário ao histórico
            messages.push({role: 'user', content: userInput}); 

            // Realiza uma chamada à API para criar uma conversa
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
            });
            
            // Exibe a resposta do chatbot no console
            const completionText = completion.choices[0].message.content;
            
            // Saida do bot
            if(userInput.toLowerCase() === 'exit'){ // Verifica se a mensagem é 'exit'
                console.log(colors.bold.green('Bot: ') + completionText); // Exibe a resposta  
                break; // Encerra o loop
            }

            console.log(colors.bold.green('Bot:') + completionText); // Exibe a resposta  

            // Atualiza o histórico de conversas e resposta do chatbot
            chatHistory.push(['user', userInput]);
            chatHistory.push(['assistant', completionText]);
        
        } catch (error) {
            if (error.response) {
                console.error(colors.bold.red('Error in API call: '), error.response.data);
            } else {
                console.error(colors.bold.red('Error: '), error.message);
            }
        }
    }
}

ChatBot(); // Executa a função principal