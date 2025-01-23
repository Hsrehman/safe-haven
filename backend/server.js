const express = require('express');
const firebaseAdmin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require('./serviceAccountKey.json')), // Path to your service account key
});

const db = firebaseAdmin.firestore();

// Middleware
app.use(bodyParser.json());

// Handle form data submission
app.post('/submit-form', async (req, res) => {
  const formData = req.body;

  try {
    const docRef = await db.collection('applications').add(formData);
    res.status(200).send({ message: 'Form submitted successfully', id: docRef.id });
  } catch (error) {
    res.status(500).send({ message: 'Error submitting form', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
