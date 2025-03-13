const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { MongoClient } = require("mongodb");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const messagesRouter = require("./messagingRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/messages", messagesRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not set. Check your .env.local file.");
  process.exit(1);
}

const client = new MongoClient(MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});