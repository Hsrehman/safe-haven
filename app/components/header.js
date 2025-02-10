'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-8 sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold">
          <Link href="/">
            <a className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
              Safe Haven
            </a>
          </Link>
        </div>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8">
          <li><Link href="/"><a className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Home</a></Link></li>
          <li><Link href="/form"><a className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Get Help</a></Link></li>
          <li><Link href="/about"><a className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">About</a></Link></li>
          <li><Link href="/services"><a className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Services</a></Link></li>
          <li><Link href="/contact"><a className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contact</a></Link></li>
          <li><Link href="/login"><a className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Login</a></Link></li>
        </ul>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <ul>
              <li><Link href="/"><a className="block py-2 text-gray-700 hover:text-indigo-600">Home</a></Link></li>
              <li><Link href="/form"><a className="block py-2 text-gray-700 hover:text-indigo-600">Get Help</a></Link></li>
              <li><Link href="/about"><a className="block py-2 text-gray-700 hover:text-indigo-600">About</a></Link></li>
              <li><Link href="/services"><a className="block py-2 text-gray-700 hover:text-indigo-600">Services</a></Link></li>
              <li><Link href="/contact"><a className="block py-2 text-gray-700 hover:text-indigo-600">Contact</a></Link></li>
              <li><Link href="/login"><a className="block py-2 text-gray-700 hover:text-indigo-600">Login</a></Link></li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}