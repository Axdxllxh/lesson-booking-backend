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

// GET /search - Search for lessons by subject or location using regex
app.get('/search', async (req, res) => {
  try {
    // Retrieve the search query from the URL; default to an empty string if none is provided
    const q = req.query.q?.toLowerCase() || '';
    // Use a case-insensitive regular expression to search in subject and location fields
    const results = await lessonsCollection.find({
      $or: [
        { subject: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    }).toArray();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// POST /order - Insert a new order into the orders collection
app.post('/order', async (req, res) => {
  try {
    // Retrieve order details from the request body
    const order = req.body;
    // Insert the order into the orders collection
    await ordersCollection.insertOne(order);
    res.json({ message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Order failed' });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
