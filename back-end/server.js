import path  from 'path'; // Import path
import express from 'express'; // Import express
import cors from 'cors'; // Import cors
import dotenv from 'dotenv';  // Import dotenv
import generate from './src/controllers/generative.js'; // Import controller functions

dotenv.config(); // Load dotenv

const port = process.env.PORT || 3005; // Define port

const app = express(); // Create express app

app.use(cors()); // Enable cors 

// Middleware
// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/openai', require('./src/routes/usersRoutes'));

app.listen(port, () => { // Start the server
    console.log(`Server is running on port ${port}`); // Log a message
});

app.post('/generate', async (req, res) => { // Create a route
    // Get the answer from the form and send it to the OpenAI API
    const { queryDescription } = req.body;
    
    try {
        const roadQuery = await generate(queryDescription);
        res.json({response: roadQuery}); // Send the response
        console.log('Roadmap generated:', roadQuery); // Log the generated roadmap
    } catch (error) {
        console.error(error); // Log an error
        res.status(500).send('An error occurred'); // Send an error response
    }
});