"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm({ onSignupClick, onForgotClick }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/adminfood-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email,
          password
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("userEmail", email);
        
        router.push("/adminfood/dashboards");
      } else {
        // Show error message
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-black">
        LOGIN
      </h2>

      {error && (
        <div className="text-red-500 text-sm text-center mb-4">
          {error}
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
        />
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 accent-blue-500" />
          <span className="text-sm text-gray-800">Remember me?</span>
        </label>
        <button
          onClick={onForgotClick}
          className="text-sm text-blue-500 hover:text-black"
        >
          Forgot Password?
        </button>
      </div>
      <button 
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-500 text-white-500 py-3 rounded-lg hover:bg-blue-600 text-white transition-colors"
      >
        {loading ? "Verifying..." : "LOGIN"}
      </button>

      {/* Rest of your component remains the same */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600">
          <a href="https://accounts.google.com/signin"
            target="_blank"
            rel="noopener noreferrer" 
          >
            <FaGoogle />
          </a>
        </button>
        
        <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
          <a
            href="https://www.facebook.com/login/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
        </button>

        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
          <a
            href="https://www.linkedin.com/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </button>
      </div>
      <div className="text-center mt-6">
        <span className="text-gray-800">Need an account? </span>
        <button
          onClick={onSignupClick}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}