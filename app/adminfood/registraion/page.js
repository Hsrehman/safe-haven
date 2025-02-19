"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from '../../styles/BusyTimes.module.css';

const validateForm = (question, formData) => {
  const errors = {};
  if (question.required) {
    if (question.type === "tel") {
      if (!formData.contactNumber) {
        errors.contactNumber = "Phone number is required";
      } else if (!isValidPhoneNumber(formData.contactNumber)) {
        errors.contactNumber = "Please enter a valid 10-digit phone number";
      }
    }
    if (question.type === "address") {
      if (!formData.addressNumber) errors.addressNumber = "Address Number is required";
      if (!formData.addressPostcode) errors.addressPostcode = "Postcode is required";
      if (!formData.addressCity) errors.addressCity = "City is required";
    } else if (question.type === "checkbox-group") {
      const fieldName = question.name;
      if (formData[fieldName]?.length === 0) {
        errors[fieldName] = `Please select at least one ${question.label}`;
      }
    } else if (question.type === "email") {
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Invalid email format";
      }
    } else if (question.type === "seating") {
      if (formData.hasSeating === "yes" && !formData.seatingCapacity) {
        errors.seatingCapacity = "Please enter seating capacity";
      }
    } else if (question.type === "religion") {
      if (formData.allowAllReligions === "no" && formData.allowedReligions.length === 0) {
        errors.allowedReligions = "Please select allowed religions";
      }
    } else if (!formData[question.name]) {
      errors[question.name] = `${question.label} is required`;
    }
  }
  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(\+\d{1,3}\s?)?\d{10}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
};

const timeSlots = [
  '6a', '8a', '10a', '12p', '2p', 
  '4p', '6p', '8p'
];

const questions = [
  { label: "Owner Name", type: "text", name: "ownerName", required: true },
  { label: "Email Address", type: "email", name: "email", required: true },
  {
    label: "What kind of food do you serve?",
    type: "checkbox-group",
    name: "foodType",
    options: ["Veg", "Non-Veg", "Both"],
    required: true,
  },
  { label: "What is your address?", type: "address", name: "address", required: true },
  {
    label: "Which genders do you allow?",
    type: "checkbox-group",
    name: "allowedGenders",
    options: ["Male", "Female", "LGBTQ+"],
    required: true,
  },
  {
    label: "Do you provide takeaway containers?",
    type: "radio",
    name: "provideTakeaway",
    options: ["Yes", "No"],
    required: true,
  },
  {
    label: "Do you open on public holidays?",
    type: "radio",
    name: "openOnHolidays",
    options: ["Yes", "No"],
    required: true,
  },
  {
    label: "Do you have seating arrangements?",
    type: "seating",
    name: "seatingArrangement",
    required: true,
  },
  {
    label: "Do you allow all religions?",
    type: "religion",
    name: "religionPolicy",
    required: true,
  },
  { label: "What time and day are you busiest?", type: "busyTimes", name: "busyTimes", required: true },
  { 
    label: "Contact Number", 
    type: "tel", 
    name: "contactNumber", 
    required: true,
    placeholder: "Enter 10-digit number"
  },
];

export default function Registration() {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState('WED');
  const [companyData, setCompanyData] = useState(null);
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    foodType: [],
    addressNumber: "",
    addressPostcode: "",
    addressCity: "",
    allowedGenders: [],
    provideTakeaway: "",
    openOnHolidays: "",
    hasSeating: "no",
    seatingCapacity: "",
    allowAllReligions: "yes",
    allowedReligions: [],
    busyTimes: {
      MON: Object.fromEntries(timeSlots.map(time => [time, 0])),
      TUE: Object.fromEntries(timeSlots.map(time => [time, 0])),
      WED: Object.fromEntries(timeSlots.map(time => [time, 0])),
      THU: Object.fromEntries(timeSlots.map(time => [time, 0])),
      FRI: Object.fromEntries(timeSlots.map(time => [time, 0])),
      SAT: Object.fromEntries(timeSlots.map(time => [time, 0])),
      SUN: Object.fromEntries(timeSlots.map(time => [time, 0]))
    },
    contactNumber: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const renderBusyTimes = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return (
      <div className="mb-4">
        <h3 className="font-bold mb-2 text-lg text-black">Popular times</h3>
        <div className="bg-gray-900 text-white p-6 rounded-lg">
          <div className="flex justify-between mb-6">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`${styles.dayButton} ${
                  day === activeDay ? styles.dayButtonActive : styles.dayButtonInactive
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className={styles.graphContainer}>
            <div className={styles.graphBars}>
              {timeSlots.map((time) => (
                <div key={time} className="flex-1 h-full flex items-end justify-center group">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.busyTimes[activeDay][time]}
                    onChange={(e) => handleBusyTimeChange(activeDay, time, e.target.value)}
                    className={styles.busyTimesSlider}
                  />
                  <div className="absolute bottom-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {time}: {formData.busyTimes[activeDay][time]}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddressFields = () => (
    <div className="mb-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Street Number
          </label>
          <input
            type="text"
            name="addressNumber"
            value={formData.addressNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formErrors.addressNumber && (
            <p className="text-red-500 text-xs italic">{formErrors.addressNumber}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Postcode
          </label>
          <input
            type="text"
            name="addressPostcode"
            value={formData.addressPostcode}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formErrors.addressPostcode && (
            <p className="text-red-500 text-xs italic">{formErrors.addressPostcode}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            City
          </label>
          <input
            type="text"
            name="addressCity"
            value={formData.addressCity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formErrors.addressCity && (
            <p className="text-red-500 text-xs italic">{formErrors.addressCity}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderRadioGroup = (question) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {question.label}
      </label>
      {question.options.map((option) => (
        <label key={option} className="block text-black">
          <input
            type="radio"
            name={question.name}
            value={option}
            checked={formData[question.name] === option}
            onChange={handleChange}
            className="mr-2"
          />
          {option}
        </label>
      ))}
      {formErrors[question.name] && (
        <p className="text-red-500 text-xs italic">{formErrors[question.name]}</p>
      )}
    </div>
  );

  const renderSeatingArrangement = () => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Do you have seating arrangements?
      </label>
      <div>
        <label className="block text-black">
          <input
            type="radio"
            name="hasSeating"
            value="yes"
            checked={formData.hasSeating === "yes"}
            onChange={handleChange}
            className="mr-2"
          />
          Yes
        </label>
        <label className="block text-black">
          <input
            type="radio"
            name="hasSeating"
            value="no"
            checked={formData.hasSeating === "no"}
            onChange={handleChange}
            className="mr-2"
          />
          No
        </label>
      </div>
      {formData.hasSeating === "yes" && (
        <div className="mt-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Seating Capacity
          </label>
          <input
            type="number"
            name="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}
      {formErrors.seatingCapacity && (
        <p className="text-red-500 text-xs italic">{formErrors.seatingCapacity}</p>
      )}
    </div>
  );

  const renderReligionPolicy = () => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Do you allow all religions?
      </label>
      <div>
        <label className="block text-black">
          <input
            type="radio"
            name="allowAllReligions"
            value="yes"
            checked={formData.allowAllReligions === "yes"}
            onChange={handleChange}
            className="mr-2"
          />
          Yes
        </label>
        <label className="block text-black">
          <input
            type="radio"
            name="allowAllReligions"
            value="no"
            checked={formData.allowAllReligions === "no"}
            onChange={handleChange}
            className="mr-2"
          />
          No
        </label>
      </div>
      {formData.allowAllReligions === "no" && (
        <div className="mt-2">
          <label className="block text-gray-700 text-sm font-bold mb-2 ">
            Select allowed religions
          </label>
          {["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Other"].map((religion) => (
            <label key={religion} className="block text-black">
              <input
                type="checkbox"
                name="allowedReligions"
                value={religion}
                checked={formData.allowedReligions.includes(religion)}
                onChange={handleReligionChange}
                className="mr-2"
              />
              {religion}
            </label>
          ))}
        </div>
      )}
      {formErrors.allowedReligions && (
        <p className="text-red-500 text-xs italic">{formErrors.allowedReligions}</p>
      )}
    </div>
  );

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
      case "email":
      
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {question.label}
            </label>
            <input
              type={question.type}
              name={question.name}
              value={formData[question.name]}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formErrors[question.name] && (
              <p className="text-red-500 text-xs italic">{formErrors[question.name]}</p>
            )}
          </div>
        );
        case "tel":
          return (
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2">
                {question.label}
              </label>
              <input
                type="tel"
                name={question.name}
                value={formData[question.name]}
                onChange={handlePhoneChange}
                placeholder={question.placeholder}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                maxLength="15" // Allow for country code and spaces
              />
              {formErrors[question.name] && (
                <p className="text-red-500 text-xs italic">{formErrors[question.name]}</p>
              )}
              <p className="text-gray-600 text-xs mt-1">
                Format: +91 1234567890 or 1234567890
              </p>
            </div>
          ); 
      case "checkbox-group":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {question.label}
            </label>
            {question.options.map((option) => (
              <label key={option} className="block text-black">
                <input
                  type="checkbox"
                  name={question.name === "foodType" ? option : question.name}
                  value={option}
                  checked={formData[question.name].includes(option)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            {formErrors[question.name] && (
              <p className="text-red-500 text-xs italic">{formErrors[question.name]}</p>
            )}
          </div>
        );
      case "radio":
        return renderRadioGroup(question);
      case "address":
        return renderAddressFields();
      case "seating":
        return renderSeatingArrangement();
      case "religion":
        return renderReligionPolicy();
      case "busyTimes":
        return renderBusyTimes();
      default:
        return null;
    }
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters except '+' and spaces
    let formattedValue = value.replace(/[^\d\s+]/g, '');
    
    // Ensure only one '+' at the start
    if (formattedValue.startsWith('+')) {
      formattedValue = '+' + formattedValue.substring(1).replace(/\+/g, '');
    }
  
    // Update form data
    setFormData(prevData => ({
      ...prevData,
      [name]: formattedValue
    }));
  
    // Clear any existing errors for this field
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleBusyTimeChange = (day, time, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      busyTimes: {
        ...prevFormData.busyTimes,
        [day]: {
          ...prevFormData.busyTimes[day],
          [time]: parseInt(value)
        }
      }
    }));
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormErrors({ ...formErrors, [name]: "" });

    if (type === "checkbox") {
      if (name === "allowedReligions") {
        handleReligionChange(e);
      } else {
        setFormData((prevData) => {
          const fieldName = name === "Veg" || name === "Non-Veg" || name === "Both" 
            ? "foodType" 
            : name;
          const updatedArray = checked
            ? [...prevData[fieldName], value || name]
            : prevData[fieldName].filter((option) => option !== (value || name));
          return { ...prevData, [fieldName]: updatedArray };
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleReligionChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      allowedReligions: checked
        ? [...prevData.allowedReligions, value]
        : prevData.allowedReligions.filter(r => r !== value)
    }));
  };

  const handleNext = () => {
    const errors = validateForm(questions[currentPage], formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (window.confirm("Are you sure you want to go back? Your progress will be saved.")) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allErrors = {};
    questions.forEach((question) => {
      const questionErrors = validateForm(question, formData);
      Object.assign(allErrors, questionErrors);
    });

    setFormErrors(allErrors);

    if (Object.keys(allErrors).length === 0) {
      try {
        setIsLoading(true);
        const registrationData = { ...companyData, ...formData };
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registrationData),
        });

        if (response.ok) {
          localStorage.removeItem("companyData");
          setSubmissionSuccess(true);
          setTimeout(() => {
            router.replace("/adminfood/dashboard");
          }, 2000);
        } else {
          const data = await response.json();
          throw new Error(data.message || "Registration failed");
        }
      } catch (error) {
        alert(error.message || "An error occurred during registration");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const checkCompanyData = async () => {
      try {
        const storedData = localStorage.getItem("companyData");
        if (storedData) {
          setCompanyData(JSON.parse(storedData));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading company data:", error);
        setIsLoading(false);
      }
    };

    checkCompanyData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Registration Page</h1>
        {submissionSuccess && <p className="text-green-500 mb-4 text-center">Registration successful!</p>}
        <form onSubmit={handleSubmit}>
          {renderQuestion(questions[currentPage])}
          <div className="flex justify-between mt-4">
            {currentPage > 0 && (
              <button 
                type="button" 
                onClick={handlePrevious}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Previous
              </button>
            )}
            {currentPage < questions.length - 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button 
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}