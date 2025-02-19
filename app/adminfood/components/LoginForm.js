"use client";
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function LoginForm({ onSignupClick, onForgotClick }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">LOGIN</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2 accent-pink-500"
          />
          <span className="text-sm text-gray-600">Remember me?</span>
        </label>
        <button
          onClick={onForgotClick}
          className="text-sm text-gray-600 hover:text-pink-500"
        >
          Forgot Password?
        </button>
      </div>
      <button
        className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
      >
        LOGIN
      </button>
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
          <FaGoogle />
        </button>
        <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
          <FaFacebook />
        </button>
        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
          <FaLinkedin />
        </button>
      </div>
      <div className="text-center mt-6">
        <span className="text-gray-600">Need an account? </span>
        <button
          onClick={onSignupClick}
          className="text-pink-500 hover:text-pink-600 font-medium"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}