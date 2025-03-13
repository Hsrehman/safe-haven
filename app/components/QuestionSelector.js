import { motion, AnimatePresence } from 'framer-motion';
import { formQuestions } from '@/app/utils/formQuestions';
import { ArrowLeft, Check, Plus, Save, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuestionSelector({ formData, onQuestionSelect }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  
  const visibleQuestions = formQuestions.filter(q => {
    
    if (q.id in formData) return true;
    return true; 
  });

  const formatAnswer = (question, answer) => {
    if (!answer) return 'Not answered yet';
    
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    
    if (question.type === 'radio' || question.type === 'select') {
      return answer;
    }
    
    if (question.type === 'date') {
      return new Date(answer).toLocaleDateString();
    }
    
    return String(answer);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      
      const storedFormData = localStorage.getItem('formData');
      let formId = null;
      let formDataToSend = formData;

      if (storedFormData) {
        try {
          const parsedData = JSON.parse(storedFormData);
          formId = parsedData.id;
          formDataToSend = parsedData.data;
        } catch (error) {
          console.error('Error parsing stored form data:', error);
        }
      }
      
      
      const response = await fetch('/api/userForm/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formDataToSend,
          formId: formId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save changes');
      }

      const result = await response.json();

      
      setNotification({
        type: 'success',
        message: result.message
      });
      
      
      localStorage.setItem('savedFormData', JSON.stringify({
        data: formDataToSend,
        timestamp: new Date().toISOString(),
        id: formId || result.id
      }));
      
      
      setTimeout(() => {
        router.push('/shelterPortal/shelterOptions');
      }, 1500);
    } catch (error) {
      console.error('Error saving form:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to save changes. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${
                  notification.type === 'success' 
                    ? 'bg-green-100 border-green-400 text-green-700' 
                    : 'bg-red-100 border-red-400 text-red-700'
                } border px-4 py-3 rounded-lg mb-6 relative`}
                role="alert"
              >
                <strong className="font-bold">
                  {notification.type === 'success' ? 'Success! ' : 'Error! '}
                </strong>
                <span className="block sm:inline">{notification.message}</span>
                <button
                  onClick={() => setNotification(null)}
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <X className={`h-5 w-5 ${
                    notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/shelterPortal/shelterOptions')}
              className="p-2 hover:bg-white/50 rounded-full transition-colors group"
              disabled={isSaving}
            >
              <ArrowLeft className="w-6 h-6 text-[#3B82C4] group-hover:text-[#1A5276] transition-colors" />
            </button>
            
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: isSaving ? 1 : 1.02 }}
              whileTap={{ scale: isSaving ? 1 : 0.98 }}
              className={`flex items-center px-6 py-3 bg-gradient-to-r from-[#3B82C4] to-[#1A5276] 
              text-white rounded-xl font-medium transition-all duration-300 shadow-md
              ${isSaving 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-[#1F6A91] hover:to-[#0C374A] hover:shadow-lg'}`}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>

          
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82C4] to-[#1A5276]">
                Review Your Answers
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Click on any question to view or edit your response
              </p>
            </motion.div>
          </div>

          
          <div className="space-y-4 mb-8">
            {visibleQuestions.map((question, index) => {
              const hasAnswer = formData[question.id] !== undefined;
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => onQuestionSelect(question)}
                  className={`bg-white p-6 rounded-2xl shadow-lg border ${
                    hasAnswer ? 'border-green-200' : 'border-gray-200'
                  } cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                >
                  
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    hasAnswer ? 'bg-gradient-to-b from-[#3B82C4] to-[#1A5276]' : 'bg-gray-200'
                  }`} />
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-grow pl-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#3B82C4] transition-colors">
                        {question.question}
                      </h3>
                      <p className={`${
                        hasAnswer 
                          ? 'text-gray-600' 
                          : 'text-gray-400 italic'
                      } text-lg`}>
                        {formatAnswer(question, formData[question.id])}
                      </p>
                    </div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      hasAnswer 
                        ? 'bg-gradient-to-r from-[#3B82C4] to-[#1A5276]' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    } transition-all duration-300`}>
                      {hasAnswer ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Plus className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 