import React from 'react';
import LondonFoodBankMap from '../../components/LondonFoodBankMap.js';

export default function FindAMeal() {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-4">Find a Meal</h1>
      <LondonFoodBankMap />
    </div>
  );
}