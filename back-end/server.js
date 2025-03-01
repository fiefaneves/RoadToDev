import express from 'express'; // Import express
import dotenv from 'dotenv';  // Import dotenv
import routes from './src/routes/usersRoutes.js';
import bodyParser from 'body-parser';

dotenv.config(); // Load dotenv

const port = process.env.PORT || 3005; // Define port

const app = express(); // Create express app

app.use(express.json());
app.use(bodyParser.urlencoded({ extended : true }));

routes(app);



app.listen(port, () => { // Start the server
    console.log(`Server is running on port ${port}`); // Log a message
});