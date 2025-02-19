import openai from '../config/open-ai.js'; // Importa o pacote openai
import readlineSync from 'readline-sync'; // Importa o pacote readline-sync
import colors from 'colors'; // Importa o pacote colors
import generate from './generative.js';
import user from "../models/usersModel.js"

class UsersController {
     static async criarRoadMap(req, res){
        // Get the answer from the form and send it to the OpenAI API
        const { queryDescription } = req.body;
        
        try {
            const roadQuery = await generate(queryDescription);
            user.create({
                name: "julia", interesse: "front", experiencia: "$$$", tecnologia: "---p", roadmap:roadQuery
            });
            res.json({response: roadQuery}); // Send the response
            console.log('Roadmap generated successfully'); // Log the generated roadmap
        } catch (error) {
            console.error(error); // Log an error
            res.status(500).send('An error occurred'); // Send an error response
        }
     }
};

export default UsersController;