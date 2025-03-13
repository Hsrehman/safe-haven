"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function SignupForm({ onLoginClick }) {
  const [formData, setFormData] = useState({
    charityName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Initialize the router

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/adminfood-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          charityName: formData.charityName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration successful!");

      
      setTimeout(() => {
        router.push("/adminfood/registraion"); // Redirect to the registration page
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-black">
        FoodBank Signup
      </h2>
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-100 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}
      <div>
        <input
          type="text"
          name="charityName"
          value={formData.charityName}
          onChange={handleChange}
          placeholder="Enter your charity name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
          required
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Set a password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Signing up..." : "Submit"}
      </button>
      <div className="text-center mt-6">
        <span className="text-gray-600">Already have an account? </span>
        <button
          type="button"
          onClick={onLoginClick}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          LOGIN
        </button>
      </div>
    </form>
  );
}