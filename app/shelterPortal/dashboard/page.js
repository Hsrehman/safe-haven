'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logger from '@/app/utils/logger';
import { sanitizeData } from '@/app/utils/sanitizer';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        logger.dev('Fetching dashboard data...');
        
        const response = await fetch('/api/shelterAdmin/dashboard', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        
        logger.dev('Dashboard response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            logger.dev('Authentication failed, redirecting to login...');
            router.push('/shelterPortal/login');
            throw new Error('Please log in to access the dashboard');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load dashboard');
        }
        
        const responseData = await response.json();
        logger.dev('Dashboard data received:', sanitizeData(responseData));
        
        if (!responseData.success) {
          throw new Error(responseData.message || 'Failed to load dashboard data');
        }
        
        setData(responseData);
      } catch (error) {
        logger.error(error, 'Dashboard - fetchData');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/shelterAdmin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        router.push('/shelterPortal/login');
      } else {
        logger.error(new Error('Logout failed'), 'Dashboard - handleLogout');
      }
    } catch (error) {
      logger.error(error, 'Dashboard - handleLogout');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/shelterAdmin/user', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        logger.dev('User data fetched:', sanitizeData(data));
        setData(data);
      } else {
        throw new Error(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      logger.error(error, 'Dashboard - fetchUserData');
      setError('Failed to load user data');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard</h3>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h3 className="text-xl font-semibold text-red-600 mb-4">Error</h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/shelterPortal/login')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Shelter Management Portal</h3>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {data?.data?.user?.adminName || 'Admin'}
            </span>
            <button 
              onClick={handleLogout}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Welcome</h4>
          <p className="text-gray-600">{data?.data?.message || 'Welcome to your dashboard!'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Shelter Information Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Shelter Information</h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Shelter ID:</span>
                <p className="text-gray-700 font-medium">{data?.data?.user?.shelterId || 'Not available'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Admin ID:</span>
                <p className="text-gray-700 font-medium">{data?.data?.user?.id || 'Not available'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Role:</span>
                <p className="text-gray-700 font-medium">{data?.data?.user?.role || 'Admin'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Verification Status:</span>
                <p className="text-gray-700 font-medium">
                  {data?.data?.user?.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300">
                Manage Shelter Profile
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300">
                View Available Pets
              </button>
              <button 
                onClick={() => router.push('/shelterPortal/change-password')} 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h4>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Total Pets:</span>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Pending Adoptions:</span>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Completed Adoptions:</span>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
            © 2025 Safe Haven Shelter Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}