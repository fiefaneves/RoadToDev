const express = require('express'); // Import express
const { generateImage } = require('../controllers/openaiController'); // Import controller functions
const router = express.Router(); // Create express router

router.post('/generateimage', generateImage);

module.exports = router; // Export router