"use client";

import { useState, useEffect } from "react";

export default function Messaging() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [botTyping, setBotTyping] = useState(false);
  const [error, setError] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
      if (!welcomeMessageShown) {
        fetchWelcomeMessage();
        setWelcomeMessageShown(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWelcomeMessage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/messages/welcome-message");
      if (!res.ok) throw new Error("Failed to load welcome message");
      const data = await res.json();
      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg.text === data.text);
        return alreadyExists ? prev : [...prev, data];
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const newMessage = { from: "User", text: messageText, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, newMessage]);
    setText("");
    setBotTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/messages/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      if (data.botMessage) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { ...data.botMessage, timestamp: new Date().toISOString() }]);
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBotTyping(false);
    }
  };

  const handleQuickReply = (option) => {
    sendMessage(option);
    setShowQuickReplies(false);

    const autoReplies = {
      "I need food assistance": "We have multiple food assistance programs available. Please visit the nearest food bank for help.",
      "I need a shelter": "We can help you find emergency shelter. Visit our shelter page or contact our support team for details.",
      "How do I register for help?": "You can register online or visit our help center for assistance.",
      "Where is the nearest food bank?": "Please enter your location, and we will find the nearest food bank for you."
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: autoReplies[option], timestamp: new Date().toISOString() }]);
    }, 1500);
  };

  return (
    <div>
      <button className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={() => setIsChatOpen(!isChatOpen)}>
        💬
      </button>

      {isChatOpen && (
        <div className="fixed bottom-16 right-5 bg-white w-96 h-[500px] shadow-xl border rounded-lg flex flex-col">
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Chat Assistant</span>
            <button onClick={() => setIsChatOpen(false)} className="text-xl hover:text-gray-200 transition">✖</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-100">
            {loading && <div className="text-center text-gray-500">Loading messages...</div>}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"} my-2`}>
                <div className={`relative p-3 rounded-lg max-w-[75%] shadow 
                    ${msg.from === "bot" ? "bg-white border border-gray-300" : "bg-blue-500 text-white"}`}>
                  <div>{msg.text}</div>
                  <div className={`mt-1 text-xs font-semibold ${msg.from === "bot" ? "text-gray-600" : "text-white opacity-80"}`}>
                    {formatTimestamp(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showQuickReplies && (
            <div className="p-2 border-t flex flex-wrap gap-2 bg-gray-200">
              {["I need food assistance", "I need a shelter", "How do I register for help?", "Where is the nearest food bank?"].map((option, index) => (
                <button key={index} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-blue-600 transition"
                  onClick={() => handleQuickReply(option)}>
                  {option}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t flex items-center gap-2 bg-white">
            <input type="text" placeholder="Type a message..." className="flex-1 border rounded-lg p-2"
              value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(text); }} />
            <button onClick={() => sendMessage(text)} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}