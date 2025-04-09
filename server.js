// Import modules: Express, CORS, and MongoClient from the MongoDB driver
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
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
    const lessons = await lessonsCollection.find().toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// GET /search - Search for lessons by subject or location using regex
app.get('/search', async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase() || '';
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
    const order = req.body;
    await ordersCollection.insertOne(order);
    res.json({ message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Order failed' });
  }
});

// PUT /lessons/:id - Update a lesson's attributes by its ID
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = new ObjectId(req.params.id);
    const updateData = req.body;
    const result = await lessonsCollection.updateOne(
      { _id: lessonId },
      { $set: updateData }
    );
    if (result.matchedCount === 1) {
      res.json({ msg: 'success' });
    } else {
      res.json({ msg: 'error' });
    }
  } catch (err) {
    console.error("Error during PUT /lessons/:id:", err);
    res.status(500).json({ error: 'Update failed: ' + err.message });
  }
});

// DELETE /lessons/:id - Delete a lesson using its ObjectId
app.delete('/lessons/:id', async (req, res) => {
  try {
    const lessonId = new ObjectId(req.params.id);
    const result = await lessonsCollection.deleteOne({ _id: lessonId });
    if (result.deletedCount === 1) {
      res.json({ msg: 'success' });
    } else {
      res.json({ msg: 'error' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});

// Testing middleware - commented out after testing
// app.get('/test-error', (req, res) => {
//   throw new Error("Test error");
// });

// Global error handling middleware to catch and log any unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});