const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('safe-haven');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error.code === 'ENOTFOUND') {
      console.error('MongoDB server not found. Check your connection string.');
    } else if (error.code === 18) {
      console.error('Authentication failed. Check your username and password.');
    }
    process.exit(1);
  }
}


connectDB();


app.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    formData.createdAt = new Date();

    const result = await db.collection('formResponses').insertOne(formData);
    res.status(201).json({
      success: true,
      id: result.insertedId,
      message: 'Form submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});