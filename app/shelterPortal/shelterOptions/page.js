'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ShelterOptionsPage() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [cardBounds, setCardBounds] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(true);
  const cardsRef = useRef([]);
  const router = useRouter();

  const handleCardClick = (index) => {
    const cardElement = cardsRef.current[index];
    const bounds = cardElement.getBoundingClientRect();
    setCardBounds(bounds);
    setExpandedCard(index);
  };

  const handleClose = () => {
    setExpandedCard(null);
  };

  const handleAmendAnswers = () => {
    router.push('/form/edit-answers');
  };

  return (
    <main className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        
        <AnimatePresence>
          {showSuccessNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 relative"
              role="alert"
            >
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">Your form has been submitted successfully.</span>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <X className="h-5 w-5 text-green-700" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex-grow"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82C4] to-[#1A5276]">
              Shelter Options
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Select from available options
            </p>
          </motion.div>
          <div className="flex gap-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
              Apply to All
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleAmendAnswers}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md"
            >
              Amend Answers
            </motion.button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              ref={el => cardsRef.current[index] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: expandedCard === index ? 0 : 1,
                y: 0 
              }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCardClick(index)}
              className="bg-white rounded-xl shadow-xl p-6 h-64 transition-all duration-300 hover:shadow-2xl cursor-pointer relative"
            >
              <button 
                className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Apply
              </button>
            </motion.div>
          ))}
        </div>

        
        <AnimatePresence>
          {expandedCard !== null && cardBounds && (
            <>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              />
              
              
              <motion.div
                initial={{
                  position: 'fixed',
                  top: cardBounds.top,
                  left: cardBounds.left,
                  width: cardBounds.width,
                  height: cardBounds.height,
                  zIndex: 50,
                }}
                animate={{
                  top: window.innerHeight * 0.1,
                  left: window.innerWidth * 0.1,
                  width: window.innerWidth * 0.8,
                  height: window.innerHeight * 0.8,
                }}
                exit={{
                  top: cardBounds.top,
                  left: cardBounds.left,
                  width: cardBounds.width,
                  height: cardBounds.height,
                }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 200,
                }}
                className="bg-white rounded-xl shadow-2xl p-6 overflow-y-auto"
              >
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                >
                  <X size={20} className="text-gray-600" />
                </button>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <h2 className="text-2xl font-bold mb-4">Option {expandedCard + 1}</h2>
                  
                  <p className="text-gray-600">
                    Expanded content for option {expandedCard + 1} goes here...
                  </p>
                </motion.div>

                <button 
                  className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Apply
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
} 