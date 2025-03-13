'use client';

import React, { useState } from 'react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St'
  });

  const [applications, setApplications] = useState([
    { id: 1, shelterName: 'Safe Haven Shelter', status: 'Pending', date: '2024-02-28' },
    { id: 2, shelterName: 'Hope House', status: 'Approved', date: '2024-02-25' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, content: 'Hello, I need assistance', sender: 'user', timestamp: '2024-02-28T10:00:00' },
    { id: 2, content: 'How can I help you?', sender: 'admin', timestamp: '2024-02-28T10:05:00' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({...userInfo});

  const handleUpdateProfile = () => {
    setUserInfo(editedInfo);
    setEditMode(false);
  };

  const handleDeleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        content: newMessage,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <div className="w-64 bg-white h-screen shadow-lg">
          <nav className="p-4 space-y-2">
            {['Profile', 'Applications', 'Messages'].map((tab) => (
              <button
                key={tab.toLowerCase()}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`w-full text-left p-2 rounded ${
                  activeTab === tab.toLowerCase() ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
  
        <div className="flex-1 p-8">
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              {editMode ? (
                <div className="space-y-4">
                  {Object.keys(editedInfo).map((field) => (
                    <input
                      key={field}
                      type={field === 'email' ? 'email' : 'text'}
                      value={editedInfo[field]}
                      onChange={(e) => setEditedInfo({...editedInfo, [field]: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditedInfo(userInfo);
                        setEditMode(false);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {Object.entries(userInfo).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                    </p>
                  ))}
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Applications</h2>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{app.shelterName}</h3>
                      <p>Status: {app.status}</p>
                      <p>Applied: {app.date}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Withdraw
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              <div className="h-96 overflow-y-auto border rounded p-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 p-2 rounded ${
                      message.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <small className="text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}