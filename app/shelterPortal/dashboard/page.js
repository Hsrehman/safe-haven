"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Settings, User, Bell, Home } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Verifying token:", token ? "Token exists" : "No token found");
        
        if (!token) {
          console.log("No token found, redirecting to login...");
          router.push("/shelterPortal/login");
          return;
        }
  
        const response = await fetch("/api/shelterAdmin/test-protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        console.log("Token verification response:", data);
  
        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }
  
        setUserData(data.user);
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        router.push("/shelterPortal/login");
      } finally {
        setIsLoading(false);
      }
    };
  
    verifyToken();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/shelterPortal/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Shelter Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>


      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-3 bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  {userData?.email || "Shelter Administrator"}
                </p>
              </div>
            </div>
          </motion.div>


          {[
            { title: "Total Beds", value: "50", icon: Home },
            { title: "Available Beds", value: "12", icon: Home },
            { title: "Today's Check-ins", value: "8", icon: User },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <stat.icon className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Debug Information
          </h3>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}
