'use client';
import FoodBankMap from '../components/FoodBankMap';
import { useState, useEffect } from 'react';

export default function FoodbanksPage() {
  const [foodBanks, setFoodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchFoodBanks = async () => {
      try {
        const response = await fetch('/api/foodbanks');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch food banks: ${errorText}`);
        }
        const data = await response.json();
        setFoodBanks(data);
      } catch (error) {
        console.error('Error fetching food banks:', error);
        setError('Failed to load food banks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodBanks();
  }, []);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container text-red-500">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Food Banks in Greater London</h1>
      <FoodBankMap foodBanks={foodBanks} />
    </div>
  );
}


