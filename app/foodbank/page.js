"use client";
import { useState, useEffect } from 'react';

export default function Foodbank() {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/foodbank-dashboard');
      const data = await response.json();
      if (data.success) {
        setPolls(data.polls);
      } else {
        setError('Failed to fetch polls');
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading polls');
      setLoading(false);
    }
  };

  const handleOptionSelect = (pollId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [pollId]: option
    }));
  };

  const handlePollSubmit = async (pollId) => {
    if (!selectedOptions[pollId]) {
      setError('Please select an option before submitting');
      return;
    }

    try {
      const response = await fetch('/api/foodbank-dashboard/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId,
          selectedOption: selectedOptions[pollId]
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Thank you for your response!');
        // Clear selection for this poll
        setSelectedOptions(prev => {
          const newOptions = { ...prev };
          delete newOptions[pollId];
          return newOptions;
        });
        // Refresh polls to show updated results
        fetchPolls();
      } else {
        setError(data.message || 'Failed to submit response');
      }
    } catch (err) {
      setError('Error submitting response');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          {error}
          <button onClick={() => setError(null)} className="absolute top-0 right-0 px-4 py-3">×</button>
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
          {message}
          <button onClick={() => setMessage('')} className="absolute top-0 right-0 px-4 py-3">×</button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Active Polls</h2>
        {polls.length > 0 ? (
          polls.map((poll) => (
            <div key={`poll-${poll._id}`} className="mb-6 last:mb-0 border-b pb-6">
              <h3 className="font-medium mb-4">{poll.question}</h3>
              <div className="space-y-2">
                {poll.options.map((option, index) => (
                  <div key={`${poll._id}-option-${index}`} className="flex items-center">
                    <input
                      type="radio"
                      id={`${poll._id}-${index}`}
                      name={`poll-${poll._id}`}
                      value={option}
                      onChange={() => handleOptionSelect(poll._id, option)}
                      checked={selectedOptions[poll._id] === option}
                      className="mr-2"
                    />
                    <label htmlFor={`${poll._id}-${index}`} className="flex-grow">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePollSubmit(poll._id)}
                className={`mt-4 px-4 py-2 rounded ${
                  selectedOptions[poll._id]
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!selectedOptions[poll._id]}
              >
                Submit Response
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No active polls at the moment.</p>
        )}
      </div>
    </div>
  );
}