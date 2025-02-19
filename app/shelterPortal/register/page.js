"use client";
import Script from 'next/script';
import { shelterFormQuestions } from "@/app/utils/shelterFormQuestions";
import {
  OPTIONAL_FIELDS,
  validateField,
  validateForm,
} from "@/app/utils/shelterFormValidation";
import PlacesAutocomplete from '@/app/components/PlacesAutocomplete';
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ClipboardList, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

  


const fadeIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const shouldShowField = (field, formData) => {
  const conditions = {
    customHours: () => formData.operatingHours === "Custom Hours",
    maxFamilySize: () => formData.acceptsFamilies === "Yes",
    ageDetails: () => formData.hasAgeRestrictions === "Yes",
    medicalDetails: () => formData.hasMedical === "Yes",
    mentalHealthDetails: () => formData.hasMentalHealth === "Yes",
    curfewDetails: () => formData.hasCurfew === "Yes",
    otherLanguages: () => formData.languages?.includes("Other"),
  };

  return conditions[field.id] ? conditions[field.id]() : true;
};

const ErrorMessage = ({ error }) => (
  <AnimatePresence>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-red-500 text-sm mt-1 ml-2"
      >
        {error}
      </motion.p>
    )}
  </AnimatePresence>
);

const FormField = ({
    field,
    value,
    onChange,
    onBlur,
    error,
    formData,
    handleChange,
  }) => {
    const baseStyle =
      "w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82C4] focus:border-[#1A5276] transition-all duration-300 bg-gray-50 text-[#1F3A52]";
    const errorStyle = "border-red-500 bg-red-50";
    const validStyle = "border-gray-200 hover:border-purple-300";
  
    const fieldStyle = `${baseStyle} ${error ? errorStyle : validStyle}`;
  
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              onBlur={() => onBlur(field.id)}
              className={`${fieldStyle} transform transition-all duration-300 hover:scale-[1.01]`}
            />
          </motion.div>
        );
  
      case "address":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <PlacesAutocomplete
              value={value || ""}
              onChange={(newValue) => onChange(field.id, newValue)}
              onSelect={(location) => {
                onChange(field.id, location.address);
                onChange(`${field.id}_coordinates`, {
                  lat: location.latitude,
                  lng: location.longitude
                });
              }}
              error={error}
            />
          </motion.div>
        );
  
      case "select":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <select
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              onBlur={() => onBlur(field.id)}
              className={`${fieldStyle} transform transition-all duration-300 hover:scale-[1.01]`}
            >
              <option value="">Select...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </motion.div>
        );
  
      case "radio":
        return (
          <motion.div className="space-y-3">
            {field.options.map((opt, index) => (
              <motion.label
                key={opt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <input
                  type="radio"
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  onBlur={() => onBlur(field.id)}
                  className="w-5 h-5 text-[#3B82C4]"
                />
                <span className="ml-3 text-gray-700">{opt}</span>
              </motion.label>
            ))}
          </motion.div>
        );
  
      case "checkbox-group":
        return (
          <motion.div className="space-y-3">
            {field.options.map((opt, index) => (
              <motion.label
                key={opt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <input
                  type="checkbox"
                  checked={(value || []).includes(opt)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, opt]
                      : currentValues.filter(v => v !== opt);
                    onChange(field.id, newValues);
                  }}
                  className="w-5 h-5 text-[#3B82C4]"
                />
                <span className="ml-3 text-gray-700">{opt}</span>
              </motion.label>
            ))}
          </motion.div>
        );
  
      case "textarea":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <textarea
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              onBlur={() => onBlur(field.id)}
              className={`${fieldStyle} h-32 transform transition-all duration-300 hover:scale-[1.01]`}
            />
          </motion.div>
        );
  
      case "compound":
        const mainValue = formData?.[field.subQuestions[0].id] || "";
        const subValue = formData?.[field.subQuestions[1].id] || "";
  
        return (
          <motion.div className="space-y-4">
            <div className="space-y-3">
              {field.subQuestions[0].options.map((opt, index) => (
                <motion.label
                  key={opt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <input
                    type="radio"
                    value={opt}
                    checked={mainValue === opt}
                    onChange={(e) =>
                      handleChange(field.subQuestions[0].id, e.target.value)
                    }
                    className="w-5 h-5 text-[#3B82C4]"
                  />
                  <span className="ml-3 text-gray-700">{opt}</span>
                </motion.label>
              ))}
            </div>
            <AnimatePresence>
              {mainValue === "Yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {field.subQuestions[1].type === "number" ? (
                    <input
                      type="number"
                      min="0"
                      max="20"
                      placeholder={field.subQuestions[1].placeholder}
                      value={subValue}
                      onChange={(e) =>
                        handleChange(field.subQuestions[1].id, e.target.value)
                      }
                      className={`${fieldStyle} transform transition-all duration-300 hover:scale-[1.01]`}
                    />
                  ) : (
                    <textarea
                      placeholder={field.subQuestions[1].placeholder}
                      value={subValue}
                      onChange={(e) =>
                        handleChange(field.subQuestions[1].id, e.target.value)
                      }
                      className={`${fieldStyle} h-32 transform transition-all duration-300 hover:scale-[1.01]`}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
  
      case "checkbox":
        return (
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(field.id, e.target.checked)}
              onBlur={() => onBlur(field.id)}
              className="w-5 h-5 text-[#3B82C4]"
            />
            <span className="ml-3 text-gray-700">{field.label}</span>
          </motion.label>
        );
  
      default:
        return null;
    }
  };
  



export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  



    const getVisibleQuestions = () =>
      shelterFormQuestions.filter((q) => shouldShowField(q, formData));
    const currentQuestion = getVisibleQuestions()[step];
  
    const handleChange = (id, value) => {
      setFormData((prev) => ({ ...prev, [id]: value }));
  

      if (errors[id]) {
        setErrors((prev) => ({
          ...prev,
          [id]: null,
        }));
      }
    };
  
    const handleBlur = (id) => {
      const field = shelterFormQuestions.find((q) => q.id === id);
      if (field) {
        const validation = validateField(field, formData[id]);
        setErrors((prev) => ({
          ...prev,
          [id]: validation.isValid ? null : validation.error,
        }));
      }
    };
  
    const handleNext = () => {
      const validation = validateField(
        currentQuestion,
        formData[currentQuestion.id],
        formData
      );
  
      if (!validation.isValid) {
        if (currentQuestion.type === "compound") {
          const hasChildrenValue = formData[currentQuestion.subQuestions[0].id];
          if (!hasChildrenValue) {
            setErrors((prev) => ({
              ...prev,
              [currentQuestion.subQuestions[0].id]: validation.error,
            }));
          } else if (hasChildrenValue === "Yes") {
            setErrors((prev) => ({
              ...prev,
              [currentQuestion.subQuestions[1].id]: validation.error,
            }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            [currentQuestion.id]: validation.error,
          }));
        }
        return;
      }
  
      if (step < getVisibleQuestions().length - 1) {
        setStep((s) => s + 1);
      }
    };
  
    const handleSubmit = async () => {
      const { isValid, errors: validationErrors } = validateForm(
        formData,
        getVisibleQuestions()
      );
  
      console.group("Shelter Registration Process");
      console.log("[Form Data]:", {
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      console.log("[Validation Status]:", { isValid, errors: validationErrors });
  
      if (!isValid) {
        console.error("[Validation Failed]:", validationErrors);
        console.groupEnd();
        setErrors(validationErrors);
        return;
      }
  
      setIsSubmitting(true);
      console.log("[Starting] Registration submission process...");
  
      try {
        const shelterData = {
          ...formData,
          status: 'pending',
          registrationDate: new Date().toISOString(),
          location: {
            address: formData.location,
            coordinates: formData.location_coordinates
          }
        };
  
        const response = await fetch('/api/shelterAdmin/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(shelterData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
  
        console.log("[Success] Registration submitted!", {
          shelterId: data.shelterId,
          timestamp: new Date().toISOString(),
        });
  
        alert("Registration submitted successfully! Your application will be reviewed.");
        router.push('/shelterPortal/dashboard');
  
      } catch (error) {
        console.error("[Error] Registration Failed:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setIsSubmitting(false);
        console.log("[Completed] Registration process");
        console.groupEnd();
      }
    };
  
    if (!currentQuestion) return null;
  
    return (
        <>
        <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
        strategy="beforeInteractive"
      />
      <main className="flex-grow bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3B82C4] to-[#1A5276]">
              Register Your Shelter
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Join our network of safe spaces and help those in need
            </p>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-[#3B82C4]">
                  <ClipboardList className="w-5 h-5" />
                  <span className="font-medium">Registration Progress</span>
                </div>
                <div className="mt-3">
                  <div className="h-2 bg-[#D3E0EA] rounded-full overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-[#3B82C4] to-[#1A5276] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${
                          ((step + 1) / getVisibleQuestions().length) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span className="font-medium">
                      Question {step + 1} of {getVisibleQuestions().length}
                    </span>
                    <span className="font-medium">
                      {Math.round(
                        ((step + 1) / getVisibleQuestions().length) * 100
                      )}
                      % completed
                    </span>
                  </div>
                </div>
              </div>
  
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeIn}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                      {currentQuestion.question}
                      {!OPTIONAL_FIELDS[currentQuestion.id] && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-pink-500 ml-1 inline-block"
                        >
                          *
                        </motion.span>
                      )}
                    </h2>
  
                    <FormField
                      field={currentQuestion}
                      value={formData[currentQuestion.id]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors[currentQuestion.id]}
                      formData={formData}
                      handleChange={handleChange}
                    />
                    <ErrorMessage error={errors[currentQuestion.id]} />
                  </motion.div>
                </AnimatePresence>
  
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-between mt-10 pt-6 border-t border-gray-100"
                >
                  <motion.button
                    onClick={() => setStep((s) => s - 1)}
                    disabled={step === 0}
                    whileHover={step !== 0 ? { scale: 1.02, x: -5 } : {}}
                    whileTap={step !== 0 ? { scale: 0.98 } : {}}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 
                      ${
                        step === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </motion.button>
  
                  {step === getVisibleQuestions().length - 1 ? (
                    <motion.button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center px-8 py-3 bg-gradient-to-r from-[#3B82C4] to-[#1A5276] 
                        text-white rounded-xl font-medium hover:from-[#1F6A91] hover:to-[#0C374A] hover:shadow-lg transition-all duration-200
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center"
                        >
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </motion.span>
                      ) : (
                        <>
                          <span>Submit Registration</span>
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleNext}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center px-8 py-3 bg-gradient-to-r from-[#3B82C4] to-[#1A5276] 
                      text-white rounded-xl font-medium hover:from-[#1F6A91] hover:to-[#0C374A] hover:shadow-lg transition-all duration-200"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      </>
    );
  }