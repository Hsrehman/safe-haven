"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user's message to state
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setIsLoading(true);
    
    try {
      // Call our custom chatbot API instead of GPT
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add chatbot response to state
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: data.response 
      }]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div 
      style={{ 
        position: "fixed", 
        bottom: "2rem", 
        right: "2rem", 
        width: "350px",
        zIndex: 1000
      }}
    >
      <button 
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#0066CC",
          color: "white",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          cursor: "pointer",
          position: "absolute",
          bottom: "0",
          right: "0"
        }}
      >
        {isOpen ? "×" : "💬"}
      </button>
      
      {isOpen && (
        <div 
          style={{ 
            backgroundColor: "#fff", 
            border: "1px solid #e1e1e1", 
            borderRadius: "12px", 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            marginBottom: "70px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "450px"
          }}
        >
          <div
            style={{
              backgroundColor: "#0066CC",
              color: "white",
              padding: "15px 20px",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            Safe Haven Assistant
          </div>
          
          <div 
            style={{ 
              padding: "15px", 
              height: "330px", 
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: "#666", textAlign: "center", marginTop: "20px" }}>
                <p>Welcome to Safe Haven!</p>
                <p style={{ fontSize: "14px" }}>Ask me about shelters, food banks or any assistance you might need.</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#6B46C1" : "#f5f5f5",
                  color: msg.sender === "user" ? "white" : "#333",
                  padding: "10px 14px",
                  borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  maxWidth: "80%",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div style={{ fontSize: "14px" }}>
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a 
                          {...props} 
                          style={{ color: msg.sender === "user" ? "#f0f0f0" : "#6B46C1", textDecoration: "underline" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      )
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  padding: "10px 14px",
                  borderRadius: "18px 18px 18px 4px",
                  maxWidth: "80%"
                }}
              >
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <div className="typing-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#888", animation: "typingAnimation 1s infinite ease-in-out" }}></div>
                  <div className="typing-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#888", animation: "typingAnimation 1s infinite ease-in-out 0.2s" }}></div>
                  <div className="typing-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#888", animation: "typingAnimation 1s infinite ease-in-out 0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              display: "flex", 
              padding: "12px", 
              borderTop: "1px solid #e1e1e1",
              backgroundColor: "#f9f9f9" 
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              style={{ 
                flex: 1, 
                padding: "10px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "20px", 
                marginRight: "8px",
                fontSize: "14px",
                outline: "none",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.05)"
              }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{ 
                backgroundColor: "#6B46C1", 
                color: "white", 
                border: "none", 
                borderRadius: "50%", 
                width: "38px", 
                height: "38px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                opacity: isLoading || !input.trim() ? 0.7 : 1
              }}
            >
              <span>→</span>
            </button>
          </form>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes typingAnimation {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}