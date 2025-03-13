'use client';
import React, { useState, useEffect } from 'react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/foodbank-admin/reviews');
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return React.createElement('div', null, 'Loading reviews...');
  if (error) return React.createElement('div', null, 'Error: ', error);

  return React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-md' },
    React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, 'Community Reviews'),
    React.createElement('div', { className: 'space-y-4' },
      reviews.map(review => React.createElement('div', { key: review._id, className: 'border p-4 rounded' },
        React.createElement('div', { className: 'flex items-center mb-2' },
          React.createElement('div', { className: 'flex text-yellow-400' },
            [...Array(review.rating)].map((_, i) => React.createElement('span', { key: i }, '★'))
          ),
          React.createElement('span', { className: 'ml-2 text-gray-600' },
            new Date(review.createdAt).toLocaleDateString()
          )
        ),
        React.createElement('p', { className: 'text-gray-700' }, review.text)
      ))
    )
  );
}