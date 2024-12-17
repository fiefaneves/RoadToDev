import express from 'express'; // Import express
import dotenv from 'dotenv';  // Import dotenv
import routes from './src/routes/usersRoutes.js';

dotenv.config(); // Load dotenv

const port = process.env.PORT || 3005; // Define port

const app = express(); // Create express app

routes(app);

app.listen(port, () => { // Start the server
    console.log(`Server is running on port ${port}`); // Log a message
});

