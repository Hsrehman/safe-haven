const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS

// Fake in-memory data storage
let users = [];

// Fake GET Method
app.get("/users", (req, res) => {
  res.status(200).json({
    message: "Users fetched successfully!",
    data: users,
  });
});

// Fake POST Method
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required!" });
  }

  // Add user to the in-memory array
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json({
    message: "User added successfully!",
    data: newUser,
  });
});

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the API! Use /users to interact with the fake database.");
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});