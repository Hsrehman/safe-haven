const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

class Database {
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI);
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db('safe-haven');
      console.log('[Database] Connected successfully to MongoDB');
      console.log('[Database] Using database: safe-haven');
    } catch (error) {
      console.error('[Database ERROR] Connection failed:', {
        error: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      });
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log('[Database] Connection closed successfully');
    } catch (error) {
      console.error('[Database ERROR] Failed to close connection:', error);
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }
}

const database = new Database();

app.post('/submit-form', async (req, res) => {
  console.log('[Form Submission] Received new submission:', {
    timestamp: new Date().toISOString(),
    formData: req.body
  });

  try {
    if (!req.body) {
      throw new Error('No form data received');
    }

    const result = await database.getDb()
      .collection('submissions')
      .insertOne({
        ...req.body,
        submittedAt: new Date(),
        status: 'submitted'
      });
    
    console.log('[Form Submission] Successfully saved to database:', {
      id: result.insertedId,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      id: result.insertedId,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('[Form Submission ERROR]:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  const dbStatus = database.getDb() ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: {
      status: 'running',
      port: port
    },
    database: {
      status: dbStatus
    }
  });
});

const start = async () => {
  try {
    await database.connect();
    app.listen(port, () => {
      console.log('[Server] Started successfully on port', port);
      console.log('[Server] Health check available at http://localhost:' + port + '/health');
    });
  } catch (error) {
    console.error('[Server ERROR] Startup failed:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n[Server] Shutting down...');
  await database.disconnect();
  console.log('[Server] Shutdown complete');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('[Server ERROR] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('[Server ERROR] Unhandled Rejection:', error);
  process.exit(1);
});

start();