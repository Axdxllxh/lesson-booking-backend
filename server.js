// Import modules: Express, CORS, and MongoClient from the MongoDB driver
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();

// Enable middleware: CORS and JSON parsing for all incoming requests
app.use(cors());
app.use(express.json());

// MongoDB Connection String 
const MONGO_URI = "mongodb+srv://Cheneywed:Cheneywed123@cluster0.mwa9fk9.mongodb.net/lessons_booking";

// Create a new MongoClient instance
const client = new MongoClient(MONGO_URI);

// Variables to hold the database and collection references
let db, lessonsCollection, ordersCollection;

// Connect to MongoDB asynchronously and initialize collections
async function connectDB() {
  try {
    await client.connect();
    db = client.db('lessons_booking');
    lessonsCollection = db.collection('lessons');
    ordersCollection = db.collection('orders'); // This collection is created on first insert
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database connection failed', err);
  }
}
connectDB();

// Basic root endpoint for testing
app.get('/', (req, res) => {
  res.send("Hello, World!");
});

// GET /lessons - Retrieve all lessons from the lessons collection
app.get('/lessons', async (req, res) => {
  try {
    // Convert the MongoDB cursor to an array of lessons
    const lessons = await lessonsCollection.find().toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
