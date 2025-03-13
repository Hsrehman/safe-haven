const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

/** ✅ 1️⃣ Welcome Message */
router.get("/welcome-message", (req, res) => {
    res.json({ sender: "bot", text: "Welcome! Please say 'Hi' to start chatting. 😊" });
});

/** ✅ 2️⃣ Send a Message */
router.post("/send-message", async (req, res) => {
    try {
        await connectDB();
        const database = client.db("safeHaven");
        const messages = database.collection("messages");
        const { from, text } = req.body;

        if (!from || !text) {
            return res.status(400).json({ message: "Sender and text are required" });
        }

        const timestamp = new Date().toISOString();
        const message = { from, text, timestamp };
        await messages.insertOne(message);

        // ✅ Auto-reply feature
        let botResponse =
            text.toLowerCase().trim() === "hi" || text.toLowerCase().trim() === "hello"
                ? "Hello! How can I assist you today?"
                : "Your message has been received! A representative will assist you shortly.";

        setTimeout(async () => {
            const botMessage = { from: "bot", text: botResponse, timestamp: new Date().toISOString() };
            await messages.insertOne(botMessage);
            res.status(200).json({ success: true, botMessage });
        }, 1500);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/** ✅ 3️⃣ Fetch All Messages */
router.get("/messages", async (req, res) => {
    try {
        await connectDB();
        const database = client.db("safeHaven");
        const messages = database.collection("messages");

        const allMessages = await messages.find().toArray();
        res.status(200).json(allMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/** ✅ 4️⃣ Upload a File */
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        await connectDB();
        const database = client.db("safeHaven");
        const files = database.collection("files");

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const file = {
            filename: req.file.originalname,
            data: req.file.buffer,
            uploadedAt: new Date(),
        };
        await files.insertOne(file);

        res.status(201).json({ message: "File uploaded successfully", filename: req.file.originalname });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;