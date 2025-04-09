// Import the necessary modules
const express = require('express');
const cors = require('cors');  // Import CORS to enable cross-origin requests
const app = express();

// Enable middleware
app.use(cors());             // Allow cross-origin requests
app.use(express.json());     // Parse incoming JSON payloads

// Basic endpoint for testing the server
app.get('/', (req, res) => {
  res.send("Hello, World!");
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
