"use client";
import { useState } from "react";

export default function ForgotPasswordForm({ onBackClick }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('http://localhost:3000/api/adminfood-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'forgotPassword',
          email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setMessage(data.message);
      // Optionally redirect to login page after a delay
      setTimeout(() => onBackClick(), 3000);
    } catch (error) {
      setError(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-8">Forgot Password</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-600 rounded">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Send Reset Link
        </button>
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onBackClick}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Back to Login
          </button>
        </div>
      </form>
    </>
  );
}