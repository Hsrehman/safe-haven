"use client";
import { useState } from "react";

// Example export in chatbot.js
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false); // To toggle the chatbot window
  const [messages, setMessages] = useState([]); // To store chat messages
  const [input, setInput] = useState(""); // To store user input

  // Predefined rules for the chatbot
  const rules = {
    "what is safe haven": "Safe Haven is a platform designed to help homeless individuals find resources, shelters, and support services.",
    "how can i find a shelter near me": "You can find shelters near you by visiting the [Shelters page](/shelters).",
    "what services does safe haven offer": "We offer services like shelter listings, food banks, counseling, and job assistance.",
    "how can i contact safe haven for help": "You can contact us by visiting the [Contact page](/contact) or calling our helpline at 123-456-7890.",
    "is safe haven free to use": "Yes, Safe Haven is completely free to use for everyone.",
    "how do i sign up for safe haven": "You can sign up by clicking [here](/signup).",
    "can i get help finding food": "Yes, you can find food banks and meal services on the [Food Resources page](/food-resources).",
    "what should i do if i need medical help": "If you need medical help, please visit the [Medical Assistance page](/medical-assistance) or call emergency services.",
    "how can i find job opportunities": "You can find job opportunities and training programs on the [Jobs page](/jobs).",
    "does safe haven provide counseling services": "Yes, we provide access to counseling services. Visit the [Counseling page](/counseling) for more information.",
    "where is the contact page": "You can find the contact page [here](/contact).",
    "how do i get to the shelters page": "You can find the shelters page [here](/shelters).",
    "where can i find food resources": "You can find food resources on the [Food Resources page](/food-resources).",
    "how do i access medical assistance": "You can access medical assistance on the [Medical Assistance page](/medical-assistance).",
    "where can i find job opportunities": "You can find job opportunities on the [Jobs page](/jobs).",
    "how do i reset my password": "You can reset your password by clicking [here](/reset-password).",
    "how do i return to the homepage": "You can return to the homepage by clicking [here](/).",
  };

  // Handle user input and generate a response
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Find a response based on rules
    const lowerCaseInput = input.toLowerCase();
    const botResponse = rules[lowerCaseInput] || "Sorry, I didn't understand that.";

    const botMessage = { sender: "bot", text: botResponse };
    setMessages((prev) => [...prev, botMessage]);

    setInput(""); // Clear the input field
  };

  return (
    <div>
      {/* Floating button to toggle chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
        }}
      >
        💬
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Chat messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f1f1",
                  color: msg.sender === "user" ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  margin: "5px 0",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input field */}
          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 15px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}