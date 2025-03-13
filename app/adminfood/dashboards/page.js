"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiClock, FiMap, FiList, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(
  () => import('../registraion/MapComponet'),
  { ssr: false }
);

const navigationItems = [
  { icon: <FiUser />, label: 'Profile', value: 'profile' },
  { icon: <FiClock />, label: 'Busy Times', value: 'busyTimes' },
  { icon: <FiMap />, label: 'Location', value: 'location' },
  { icon: <FiList />, label: 'Questions', value: 'questions' },
  { icon: <FiMessageSquare />, label: 'Messages', value: 'messages', isExternal: true, path: '/adminfood/messages' }
];

const convertToDMS = (coordinate, isLatitude) => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
  
  const direction = isLatitude 
    ? (coordinate >= 0 ? "N" : "S") 
    : (coordinate >= 0 ? "E" : "W");
  
  return `${degrees}°${minutes}'${seconds}"${direction}`;
};

function Dashboard() {
  const router = useRouter();
  const [loginData, setLoginData] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [editedData, setEditedData] = useState(null);
  const [activeDay, setActiveDay] = useState('MON');
  const [hasChanges, setHasChanges] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentQuestionPage, setCurrentQuestionPage] = useState(1);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          router.push("/adminfood/login");
          return;
        }

        const regResponse = await fetch(`/api/adminfood/getRegistrationData?email=${userEmail}`);
        const regResult = await regResponse.json();

        if (!regResult.success) {
          router.push("/adminfood/login");
          return;
        }

        setLoginData({
          email: userEmail,
          charityName: regResult.userData.charityName,
          role: regResult.userData.role
        });

        setRegistrationData(regResult.userData);
        setEditedData(regResult.userData);
      } catch (error) {
        console.error("Error:", error);
        router.push("/adminfood/login");
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchData();
  }, [router]);

  const handleInputChange = (field, value) => {
    setEditedData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      const hasChanged = JSON.stringify(newData) !== JSON.stringify(registrationData);
      setHasChanges(hasChanged);
      return newData;
    });
  };

  const handleLocationUpdate = (locationData) => {
    const { lat, lng, address } = locationData;
    const latDMS = convertToDMS(lat, true);
    const lngDMS = convertToDMS(lng, false);
    const dmsNotation = `${latDMS} ${lngDMS}`;
    
    setEditedData(prev => {
      const newData = {
        ...prev,
        location: {
          latitude: lat,
          longitude: lng,
          formattedAddress: address || "",
          dmsNotation: dmsNotation
        }
      };
      setHasChanges(true);
      return newData;
    });
  };

  const handleBusyTimeChange = (day, timeSlot, value) => {
    setEditedData(prev => {
      const newData = {
        ...prev,
        busyTimes: {
          ...prev.busyTimes,
          [day]: {
            ...prev.busyTimes?.[day],
            [timeSlot]: parseInt(value) || 0
          }
        }
      };
      setHasChanges(true);
      return newData;
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/adminfood/UpdateRegistrationData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData)
      });

      if (response.ok) {
        setRegistrationData(editedData);
        setHasChanges(false);
        alert('Changes saved successfully');
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/adminfood");
  };

  const handleNavigation = (item) => {
    if (item.isExternal) {
      router.push(item.path);
    } else {
      setActiveSection(item.value);
    }
  };

  const renderProfile = () => (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Food Bank Name</label>
          <input
            type="text"
            value={editedData?.foodBankName || ''}
            onChange={(e) => handleInputChange('foodBankName', e.target.value)}
            className="w-full border border-blue-200 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Owner Name</label>
          <input
            type="text"
            value={editedData?.ownerName || ''}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className="w-full border border-blue-200 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            value={editedData?.email || ''}
            disabled
            className="w-full border border-gray-200 rounded-md p-3 bg-gray-50 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
          <input
            type="text"
            value={editedData?.contactNumber || ''}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            className="w-full border border-blue-200 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderBusyTimes = () => (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-indigo-800 text-lg font-medium">Popular Times</h3>
          <select 
            value={activeDay}
            onChange={(e) => setActiveDay(e.target.value)}
            className="p-2 border border-blue-200 rounded-md text-indigo-700 bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          >
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
  
        <div className="relative h-[220px] mt-8">
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-indigo-700">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>
  
          <div className="ml-12 h-full flex items-end gap-3">
            {['6am', '9am', '12pm', '3pm', '6pm', '9pm'].map((time, index) => {
              // Calculate color based on value - from light red to dark red
              const value = editedData?.busyTimes?.[activeDay]?.[time] || 0;
              // Calculate RGB values for red (from light to dark)
              const r = 255; // Keep red at maximum
              const g = Math.floor(200 - (value * 1.6)); // Decrease green as value increases
              const b = Math.floor(200 - (value * 1.6)); // Decrease blue as value increases
              const barColor = `rgb(${r}, ${g}, ${b})`;
              
              return (
                <div key={time} className="flex-1 h-full flex flex-col">
                  <div className="flex-1 relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ 
                        height: `${value}%`,
                        backgroundColor: barColor
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute bottom-0 w-full rounded-t-lg shadow-md"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleBusyTimeChange(activeDay, time, e.target.value)}
                    className="w-full mt-2 accent-red-600"
                  />
                  <span className="text-center mt-2 text-sm font-medium text-indigo-700">{time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
  const renderLocation = () => (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-[400px] mb-4 rounded-lg overflow-hidden border-4 border-gradient-to-r from-blue-200 to-purple-200">
        <MapWithNoSSR
          onLocationSelect={handleLocationUpdate}
          initialLocation={
            editedData?.location?.latitude && editedData?.location?.longitude
              ? { lat: editedData.location.latitude, lng: editedData.location.longitude }
              : null
          }
        />
      </div>
      {editedData?.location && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 shadow-sm"
        >
          <p className="text-sm font-medium text-indigo-800">Selected Location:</p>
          <p className="text-sm text-indigo-700 break-words">{editedData.location.dmsNotation}</p>
          {editedData.location.formattedAddress && (
            <p className="text-sm text-indigo-600 mt-1">{editedData.location.formattedAddress}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  const renderQuestions = () => {
    // Define all questions
    const allQuestions = [
      {
        id: 'foodType',
        question: 'What kind of food do you serve?',
        options: ["Veg", "Non-Veg", "Both"],
        type: 'checkbox',
        getValue: () => editedData?.foodType || [],
        setValue: (value) => handleInputChange('foodType', value)
      },
      {
        id: 'allowedGenders',
        question: 'Which genders do you allow?',
        options: ["Male", "Female", "LGBTQ+"],
        type: 'checkbox',
        getValue: () => editedData?.allowedGenders || [],
        setValue: (value) => handleInputChange('allowedGenders', value)
      },
      {
        id: 'provideTakeaway',
        question: 'Do you provide takeaway containers?',
        options: ["Yes", "No"],
        type: 'radio',
        getValue: () => editedData?.provideTakeaway || '',
        setValue: (value) => handleInputChange('provideTakeaway', value)
      },
      {
        id: 'openOnHolidays',
        question: 'Do you open on public holidays?',
        options: ["Yes", "No"],
        type: 'radio',
        getValue: () => editedData?.openOnHolidays || '',
        setValue: (value) => handleInputChange('openOnHolidays', value)
      },
      {
        id: 'seatingArrangement',
        question: 'Do you have seating arrangements?',
        options: ["Yes", "No"],
        type: 'radio',
        getValue: () => editedData?.seatingArrangement?.hasSeating || '',
        setValue: (value) => handleInputChange('seatingArrangement', {
          ...editedData?.seatingArrangement,
          hasSeating: value
        }),
        subQuestion: {
          condition: "Yes",
          question: "Seating Capacity",
          type: "number",
          getValue: () => editedData?.seatingArrangement?.seatingCapacity || "",
          setValue: (value) => handleInputChange('seatingArrangement', {
            ...editedData?.seatingArrangement,
            seatingCapacity: value
          })
        }
      },
      {
        id: 'religionPolicy',
        question: 'Do you allow all religions?',
        options: ["Yes", "No"],
        type: 'radio',
        getValue: () => editedData?.religionPolicy?.allowAllReligions || '',
        setValue: (value) => handleInputChange('religionPolicy', {
          ...editedData?.religionPolicy,
          allowAllReligions: value,
          allowedReligions: value === "Yes" ? [] : editedData?.religionPolicy?.allowedReligions
        }),
        subQuestion: {
          condition: "No",
          question: "Select allowed religions",
          type: "checkbox",
          options: ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Other"],
          getValue: () => editedData?.religionPolicy?.allowedReligions || [],
          setValue: (value) => handleInputChange('religionPolicy', {
            ...editedData?.religionPolicy,
            allowedReligions: value
          })
        }
      }
    ];

    
    const questionsPerPage = 2;
    const startIndex = (currentQuestionPage - 1) * questionsPerPage;
    const currentQuestions = allQuestions.slice(startIndex, startIndex + questionsPerPage);

    return (
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
          {currentQuestions.map((questionItem, qIndex) => (
            <div key={questionItem.id} className="mb-6">
              <label className="block text-indigo-800 text-sm font-bold mb-3">
                {questionItem.question}
              </label>
              <div className="space-y-2">
                {questionItem.options.map((option, index) => (
                  <motion.label 
                    key={option} 
                    className="flex items-center p-3 rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 cursor-pointer w-full bg-white bg-opacity-70"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {questionItem.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={questionItem.getValue().includes(option)}
                        onChange={(e) => {
                          const currentValues = questionItem.getValue();
                          const newValues = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter(val => val !== option);
                          questionItem.setValue(newValues);
                        }}
                        className="mr-3 h-5 w-5 accent-indigo-600"
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={questionItem.getValue() === option}
                        onChange={(e) => questionItem.setValue(option)}
                        className="mr-3 h-5 w-5 accent-indigo-600"
                      />
                    )}
                    <span className="text-indigo-800 font-medium">{option}</span>
                  </motion.label>
                ))}
              </div>

              {/* Render sub-question if condition is met */}
              {questionItem.subQuestion && questionItem.getValue() === questionItem.subQuestion.condition && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 ml-6 p-4 bg-white bg-opacity-50 rounded-lg border border-blue-100"
                >
                  <label className="block text-indigo-800 text-sm font-bold mb-2">
                    {questionItem.subQuestion.question}
                  </label>
                  
                  {questionItem.subQuestion.type === 'number' ? (
                    <input
                      type="number"
                      value={questionItem.subQuestion.getValue()}
                      onChange={(e) => questionItem.subQuestion.setValue(e.target.value)}
                      className="w-full border border-blue-200 rounded-md p-3 text-indigo-800 bg-white bg-opacity-80 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    />
                  ) : (
                    <div className="space-y-2">
                      {questionItem.subQuestion.options.map((subOption, idx) => (
                        <motion.label 
                          key={subOption} 
                          className="flex items-center p-3 rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 cursor-pointer w-full bg-white bg-opacity-70"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          <input
                            type="checkbox"
                            checked={questionItem.subQuestion.getValue().includes(subOption)}
                            onChange={(e) => {
                              const currentSubValues = questionItem.subQuestion.getValue();
                              const newSubValues = e.target.checked
                                ? [...currentSubValues, subOption]
                                : currentSubValues.filter(val => val !== subOption);
                              questionItem.subQuestion.setValue(newSubValues);
                            }}
                            className="mr-3 h-5 w-5 accent-indigo-600"
                          />
                          <span className="text-indigo-800 font-medium">{subOption}</span>
                        </motion.label>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))}

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-blue-100">
            <motion.button
              onClick={() => setCurrentQuestionPage(prev => Math.max(prev - 1, 1))}
              disabled={currentQuestionPage === 1}
              className={`px-4 py-2 rounded-md ${currentQuestionPage === 1 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              whileHover={currentQuestionPage !== 1 ? { scale: 1.05 } : {}}
              whileTap={currentQuestionPage !== 1 ? { scale: 0.95 } : {}}
            >
              Previous
            </motion.button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(allQuestions.length / questionsPerPage) }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentQuestionPage(i + 1)}
                  className={`w-8 h-8 rounded-full ${currentQuestionPage === i + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-blue-600 border border-blue-200'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              onClick={() => setCurrentQuestionPage(prev => 
                Math.min(prev + 1, Math.ceil(allQuestions.length / questionsPerPage))
              )}
              disabled={currentQuestionPage === Math.ceil(allQuestions.length / questionsPerPage)}
              className={`px-4 py-2 rounded-md ${
                currentQuestionPage === Math.ceil(allQuestions.length / questionsPerPage)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              whileHover={currentQuestionPage !== Math.ceil(allQuestions.length / questionsPerPage) ? { scale: 1.05 } : {}}
              whileTap={currentQuestionPage !== Math.ceil(allQuestions.length / questionsPerPage) ? { scale: 0.95 } : {}}
            >
              Next
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <motion.div 
          animate={{ 
            rotate: 360,
            borderColor: ['#3b82f6', '#8b5cf6', '#6366f1', '#3b82f6']
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "linear"
          }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <motion.div 
        initial={{ width: "64px" }}
        animate={{ 
          width: sidebarExpanded ? "280px" : "80px",
        }}
        onHoverStart={() => setSidebarExpanded(true)}
        onHoverEnd={() => setSidebarExpanded(false)}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-blue-600 to-purple-700 shadow-xl relative z-10 flex flex-col justify-between"
      >
        <div>
          <motion.div 
            className="p-6"
            animate={{ opacity: sidebarExpanded ? 1 : 0.7 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-white truncate"
              animate={{ opacity: sidebarExpanded ? 1 : 0 }}
            >
              {loginData?.charityName}
            </motion.h2>
            <motion.p 
              className="text-blue-100 mt-2 text-sm truncate"
              animate={{ opacity: sidebarExpanded ? 1 : 0 }}
            >
              {loginData?.email}
            </motion.p>
          </motion.div>

          <nav className="mt-6">
            {navigationItems.map((item) => (
              <motion.button
                key={item.value}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "rgba(255, 255, 255, 0.15)" 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-6 py-4 space-x-3 transition-all duration-300
                  ${activeSection === item.value && !item.isExternal
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'text-blue-100 hover:text-white'}`}
              >
                <motion.div 
                  animate={{ 
                    scale: activeSection === item.value && !item.isExternal ? 1.2 : 1,
                    rotate: activeSection === item.value && !item.isExternal ? [0, 10, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-xl"
                >
                  {item.icon}
                </motion.div>
                <motion.span 
                  animate={{ 
                    opacity: sidebarExpanded ? 1 : 0,
                    x: sidebarExpanded ? 0 : -10
                  }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: "rgba(255, 255, 255, 0.15)" 
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center px-6 py-4 space-x-3 transition-all duration-300 text-blue-100 hover:text-white mb-6"
        >
          <motion.div className="text-xl">
            <FiLogOut />
          </motion.div>
          <motion.span 
            animate={{ 
              opacity: sidebarExpanded ? 1 : 0,
              x: sidebarExpanded ? 0 : -10
            }}
            className="font-medium"
          >
            Logout
          </motion.span>
        </motion.button>
      </motion.div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={activeSection}
          >
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </motion.h1>
          {hasChanges && (
            <motion.button
              onClick={handleSaveChanges}
              className="px-6 py-2.5 rounded-md bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-md"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Save Changes
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white bg-opacity-60 backdrop-blur-sm p-1 rounded-2xl shadow-lg"
          >
            {activeSection === 'profile' && renderProfile()}
            {activeSection === 'busyTimes' && renderBusyTimes()}
            {activeSection === 'location' && renderLocation()}
            {activeSection === 'questions' && renderQuestions()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dashboard;