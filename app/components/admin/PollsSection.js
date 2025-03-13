'use client';
import React, { useState, useEffect } from 'react';

export default function PollsSection() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  async function fetchPolls() {
    try {
      const response = await fetch('/api/foodbank-admin/polls');
      const data = await response.json();
      if (data.success) {
        setPolls(data.polls);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching polls');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return React.createElement('div', null, 'Loading polls...');
  if (error) return React.createElement('div', null, 'Error: ', error);

  return React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-md' },
    React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, 'Poll Results'),
    React.createElement('div', { className: 'grid grid-cols-1 gap-6' },
      polls.map(poll => React.createElement('div', { key: poll._id, className: 'border p-4 rounded' },
        React.createElement('h3', { className: 'font-medium mb-4' }, poll.question),
        React.createElement('div', { className: 'space-y-3' },
          poll.options.map((option, index) => React.createElement('div', { key: `${poll._id}-option-${index}`, className: 'space-y-1' },
            React.createElement('div', { className: 'flex justify-between text-sm' },
              React.createElement('span', null, option.text),
              React.createElement('span', { className: 'text-gray-600' }, 
                `${Math.round((option.votes / poll.totalVotes) * 100)}%`
              )
            )
          ))
        )
      ))
    )
  );
}