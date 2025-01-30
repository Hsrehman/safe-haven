'use client';
import React, { useState } from 'react';
import { 
  validateOnChange, 
  validateOnBlur, 
  validateCurrentQuestion as validateCurrentQ,
  isOptional 
} from '@/app/utils/formValidation';

export default function FormPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const formQuestions = [
    {
      id: 'fullName',
      question: 'What is your full name?',
      type: 'text',
      placeholder: 'Your name'
    },
    {
      id: 'email',
      question: 'What is your email address?',
      type: 'email',
      placeholder: 'Your email'
    },
    {
      id: 'phone',
      question: 'What is your phone number?',
      type: 'tel',
      placeholder: 'Your phone number'
    },
    {
      id: 'dob',
      question: 'What is your date of birth?',
      type: 'date',
      required: true
    },
    {
      id: 'gender',
      question: 'What is your gender?',
      type: 'select',
      options: ['Prefer not to say', 'Male', 'Female', 'Non-binary', 'Other']
    },
    {
      id: 'language',
      question: 'What is your preferred language?',
      type: 'select',
      options: ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Other']
    },
    {
      id: 'location',
      question: 'What is your current location?',
      type: 'address',
      placeholder: 'City, region, or postcode',
      required: true
    },
    {
      id: 'groupType',
      question: 'Who are you seeking shelter for?',
      type: 'radio',
      options: ['Alone', 'With a partner', 'With family']
    },
    {
      id: 'medicalConditions',
      question: 'Any medical conditions or disabilities?',
      type: 'textarea',
      placeholder: 'Please describe if any'
    },
    {
      id: 'shelterType',
      question: 'Are you looking for tonight or long-term accommodation?',
      type: 'radio',
      options: ['Tonight', 'Long-Term']
    },
    {
      id: 'foodAssistance',
      question: 'Do you need food assistance?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'financialAssistance',
      question: 'Do you need financial assistance?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'womenOnly',
      question: 'Do you require a women-only shelter?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'lgbtqFriendly',
      question: 'Do you need LGBTQ+ friendly shelters?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'pets',
      question: 'Do you have any pets?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'mentalHealth',
      question: 'Do you need mental health support?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'children',
      question: 'Do you have children with you?',
      type: 'compound',
      subQuestions: [
        {
          id: 'hasChildren',
          type: 'radio',
          options: ['Yes', 'No']
        },
        {
          id: 'childrenCount',
          type: 'number',
          placeholder: 'Number of children'
        }
      ]
    },
    {
      id: 'security',
      question: 'Do you need a shelter with 24-hour security?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'socialServices',
      question: 'Do you need social services or legal assistance?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'curfew',
      question: 'Do you prefer a shelter with a curfew?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'smoking',
      question: 'Would you prefer a shelter that allows smoking?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'communalLiving',
      question: 'Are you comfortable with communal living?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'wheelchair',
      question: 'Do you need wheelchair accessibility?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'additionalInfo',
      question: 'Any additional information?',
      type: 'textarea',
      placeholder: 'Share any other details'
    },
    {
      id: 'terms',
      question: 'Do you agree to the Terms and Conditions?',
      type: 'checkbox',
      required: true,
      label: 'I agree to the terms'
    }
  ];

  const shouldShow = q => {
    if (q.id === 'womenOnly') return formData.gender === 'Female' || formData.gender === 'Non-binary';
    if (q.id === 'children' || q.id === 'childrenCount') return formData.groupType !== 'Alone';
    if (['curfew', 'smoking', 'communalLiving'].includes(q.id)) return formData.shelterType === 'Long-Term';
    if (q.id === 'lgbtqFriendly') return formData.gender === 'Non-binary' || formData.gender === 'Other';
    if (q.id === 'mentalHealth') return formData.medicalConditions;
    if (q.id === 'socialServices') return formData.groupType !== 'Alone' || formData.financialAssistance === 'Yes';
    if (q.id === 'foodAssistance') return formData.shelterType === 'Tonight';
    if (q.id === 'wheelchair') {
      const conditions = (formData.medicalConditions || '').toLowerCase();
      return conditions.includes('mobility') || conditions.includes('wheelchair') || conditions.includes('disabled');
    }
    return true;
  };

  const getQuestions = () => formQuestions.filter(shouldShow);

  const getCurrentQ = () => getQuestions()[step];

  const handleChange = (id, val) => {
    setFormData(prev => ({...prev, [id]: val}));
    setTouched(prev => ({...prev, [id]: true}));
    
    const question = formQuestions.find(q => q.id === id);
    if (question) {
      const { isValid, error } = validateOnChange(question, val);
      if (!isValid) {
        setErrors(prev => ({ ...prev, [id]: error }));
      } else {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[id];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (id) => {
    setTouched(prev => ({ ...prev, [id]: true }));
  
    const question = formQuestions.find(q => q.id === id);
    if (question) {
      const { isValid, error } = validateOnBlur(question, formData[id]);
      if (!isValid) {
        setErrors(prev => ({ ...prev, [id]: error }));
      }
    }
  };

  const validateCurrentQuestion = () => {
    const currentQuestion = getCurrentQ();
    const { isValid, error } = validateCurrentQ(currentQuestion, formData[currentQuestion.id]);
    
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        [currentQuestion.id]: error
      }));
    }
    
    return isValid;
  };

  const goNext = () => {
    const isValid = validateCurrentQuestion();
    if (!isValid) return;

    if (step < getQuestions().length - 1) {
      setStep(s => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const submitForm = async () => {
    const isValid = validateCurrentQuestion();
    if (!isValid) return;

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit form');

      const data = await response.json();
      if (data.success) {
        alert('Form submitted successfully!');
        setFormData({});
        setStep(0);
        setErrors({});
        setTouched({});
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const renderField = q => {
    const err = errors[q.id];
    const baseStyle = `w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 
      transition-all duration-200 bg-gray-50 text-gray-800
      ${err ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-purple-300'}`;

    if (['text', 'email', 'tel', 'date', 'number', 'address'].includes(q.type)) {
      return (
        <div className="space-y-2">
          <input
            type={q.type}
            placeholder={q.placeholder}
            value={formData[q.id] || ''}
            onChange={e => handleChange(q.id, e.target.value)}
            onBlur={() => handleBlur(q.id)}
            className={`${baseStyle} hover:shadow-sm`}
          />
          {err && <p className="text-red-500 text-sm mt-1 ml-2">{err}</p>}
        </div>
      );
    }

    if (q.type === 'select') {
      return (
        <div className="space-y-2">
          <select
            value={formData[q.id] || ''}
            onChange={e => handleChange(q.id, e.target.value)}
            onBlur={() => handleBlur(q.id)}
            className={baseStyle}
          >
            <option value="">Select...</option>
            {q.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
        </div>
      );
    }

    if (q.type === 'radio') {
      return (
        <div className="space-y-3">
          {q.options.map(opt => (
            <label key={opt} className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-purple-300">
              <input
                type="radio"
                value={opt}
                checked={formData[q.id] === opt}
                onChange={e => handleChange(q.id, e.target.value)}
                onBlur={() => handleBlur(q.id)}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-3 text-gray-700 font-medium">{opt}</span>
            </label>
          ))}
          {err && <p className="text-red-500 text-sm mt-1 ml-2">{err}</p>}
        </div>
      );
    }

    if (q.type === 'checkbox') {
      return (
        <div className="space-y-2">
          <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
            <input
              type="checkbox"
              checked={formData[q.id] || false}
              onChange={e => handleChange(q.id, e.target.checked)}
              onBlur={() => handleBlur(q.id)}
              className="w-5 h-5 text-violet-600"
            />
            <span className="ml-3 text-gray-700">{q.label}</span>
          </label>
          {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
        </div>
      );
    }

    if (q.type === 'textarea') {
      return (
        <div className="space-y-2">
          <textarea
            placeholder={q.placeholder}
            value={formData[q.id] || ''}
            onChange={e => handleChange(q.id, e.target.value)}
            onBlur={() => handleBlur(q.id)}
            className={`${baseStyle} h-32`}
          />
          {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
        </div>
      );
    }

    if (q.type === 'compound') {
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {q.subQuestions[0].options.map(opt => (
              <label key={opt} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                <input
                  type="radio"
                  value={opt}
                  checked={formData[q.subQuestions[0].id] === opt}
                  onChange={e => handleChange(q.subQuestions[0].id, e.target.value)}
                  onBlur={() => handleBlur(q.subQuestions[0].id)}
                  className="w-5 h-5 text-violet-600"
                />
                <span className="ml-3 text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
          {formData[q.subQuestions[0].id] === 'Yes' && (
            <div>
              <input
                type={q.subQuestions[1].type}
                placeholder={q.subQuestions[1].placeholder}
                value={formData[q.subQuestions[1].id] || ''}
                onChange={e => handleChange(q.subQuestions[1].id, e.target.value)}
                onBlur={() => handleBlur(q.subQuestions[1].id)}
                className={baseStyle}
                min="1"
              />
            </div>
          )}
          {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
        </div>
      );
    }
  };

  const currentQ = getCurrentQ();
  const questions = getQuestions();

  if (!currentQ) return null;

  return (
    <main className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Shelter Form
          </h1>
          <p className="mt-4 text-lg md:text-xl font-normal text-gray-600">
            Finding you a safe and comfortable temporary home
          </p>
        </div>

        <div className="max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200">
          <div className="mb-10">
            <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span className="font-medium">Question {step + 1} of {questions.length}</span>
              <span className="font-medium">{Math.round(((step + 1) / questions.length) * 100)}% completed</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 transition-all duration-300">
              {currentQ.question}
              {!isOptional(currentQ.id) &&
                <span className="text-pink-500 ml-1 animate-pulse">*</span>
              }
            </h2>
            <div className="transition-all duration-300 ease-in-out">
              {renderField(currentQ)}
            </div>
          </div>

          <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={goPrev}
              disabled={step === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                step === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:-translate-x-1'
              }`}
            >
              ← Back
            </button>

            {step === questions.length - 1 ? (
              <button
                onClick={submitForm}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:translate-x-1 transition-all duration-200"
              >
                Submit Form →
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:translate-x-1 transition-all duration-200"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}