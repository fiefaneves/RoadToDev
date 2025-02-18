import cors from 'cors'; // Import cors
import  generate  from '../controllers/generative.js'; // Import controller functions
import express from 'express'
import user from '../models/usersModel.js';

const routes = (app) => {

    app.use(cors()); // Enable cors 
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.post('/generate', async (req, res) => { // Create a route
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
    });
}

export default routes;