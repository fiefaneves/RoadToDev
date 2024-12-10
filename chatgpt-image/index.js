const path  = require('path'); // Import path
const express =  require('express'); // Import express
const dotenv = require('dotenv').config();  // Import dotenv
const port = process.env.PORT || 5000; // Define port

const app = express(); // Create express app

// Middleware
// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/openai', require('./routes/openaiRoutes'));

app.listen(port, () => console.log(`Server is running on port ${port}`)); // Start server
