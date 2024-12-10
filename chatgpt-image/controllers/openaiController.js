const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Define a chave da API
});

const generateImage = async (req, res) => {
    const { prompt, size } = req.body; // Define o prompt enviado pelo cliente
    
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024'; // Define o tamanho da imagem

    try {
        const response = await openai.images.generate({
            prompt: prompt, // Define o prompt 
            n: 1, // Define o número de imagens a serem geradas
            size: imageSize, // Define o tamanho da imagem
        });

        const imageUrl = response.data.data[0].url; // Define a URL da imagem gerada

        res.status(200).json({
            sucess: true,
            data: imageUrl 
        }); // Envia a URL da imagem gerada

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log('Error', error.message);
        }

        res.status(400).json({
            sucess: false,
            error: 'Failed to generate image',
        });
    }
};

module.exports = { generateImage }; // Export controller functions