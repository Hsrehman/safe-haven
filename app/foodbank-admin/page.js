'use client';
import React from 'react';
import PollsSection from '@/components/admin/PollsSection';
import ReviewsSection from '@/components/admin/ReviewsSection';

export default function FoodbankAdmin() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Foodbank Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PollsSection />
        <ReviewsSection />
      </div>
    </div>
  );
}