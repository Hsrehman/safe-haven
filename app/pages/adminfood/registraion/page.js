"use client";

import { useState, useEffect } from "react";

export default function Registration() {
  const [companyData, setCompanyData] = useState(null);
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    foodType: [],
    addressNumber: "",
    addressPostcode: "",
    addressCity: "",
    busyTimes: {
      monday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
      tuesday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
      wednesday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
      thursday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
      friday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
      saturday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
      sunday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
    },
    contactNumber: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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
    { label: "What time and day are you busiest?", type: "busyTimes", name: "busyTimes", required: true },
    { label: "Contact Number", type: "tel", name: "contactNumber", required: true },
  ];

  useEffect(() => {
    const storedData = localStorage.getItem("companyData");
    if (storedData) {
      setCompanyData(JSON.parse(storedData));
    } else {
      alert("Please fill in the company information first.");
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const handleBusyTimeChange = (day, time) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      busyTimes: {
        ...prevFormData.busyTimes,
        [day]: {
          ...prevFormData.busyTimes[day],
          [time]: !prevFormData.busyTimes[day][time]
        }
      }
    }));
  };

  const renderBusyTimesPoll = () => {
    return (
      <div className="mb-4" key="busyTimes">
        <label className="block text-gray-700 font-medium mb-2">When are you busiest?</label>
        {daysOfWeek.map((day) => (
          <div key={day} className="mb-2 border p-2 rounded">
            <h3 className="font-medium text-gray-700 capitalize text-black">{day}:</h3>
            <div className="grid grid-cols-4 gap-2 mt-2 text-black">
              {Object.keys(formData.busyTimes[day]).map((time) => (
                <label key={time} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.busyTimes[day][time]}
                    onChange={() => handleBusyTimeChange(day, time)}
                    className="mr-2"
                  />
                  <span className="text-sm">{time}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormErrors({ ...formErrors, [name]: "" });

    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedFoodType = checked
          ? [...prevData.foodType, name]
          : prevData.foodType.filter((option) => option !== name);
        return { ...prevData, foodType: updatedFoodType };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    const errors = validateForm(questions[currentPage]);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allErrors = {};
    questions.forEach((question) => {
      const questionErrors = validateForm(question);
      Object.assign(allErrors, questionErrors);
    });

    setFormErrors(allErrors);

    if (Object.keys(allErrors).length === 0) {
      try {
        const registrationData = { ...companyData, ...formData };
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registrationData),
        });

        if (response.ok) {
          localStorage.removeItem("companyData");
          setSubmissionSuccess(true);
          setFormData({
            ownerName: "",
            email: "",
            foodType: [],
            addressNumber: "",
            addressPostcode: "",
            addressCity: "",
            busyTimes: {
              monday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
              tuesday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
              wednesday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
              thursday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
              friday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
              saturday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
              sunday: { "09:00": false, "10:00": false, "11:00": false, "12:00": false, "13:00": false, "14:00": false, "15:00": false, "16:00": false, "17:00": false, "18:00": false, "19:00": false, "20:00": false, "21:00": false },
            },
            contactNumber: "",
          });
        } else {
          alert("Registration failed. Please check your information.");
        }
      } catch (error) {
        alert("An error occurred during registration. Please try again later.");
      }
    }
  };

  const validateForm = (question) => {
    const errors = {};
    if (question.required) {
      if (question.type === "address") {
        if (!formData.addressNumber) errors.addressNumber = "Address Number is required";
        if (!formData.addressPostcode) errors.addressPostcode = "Postcode is required";
        if (!formData.addressCity) errors.addressCity = "City is required";
      } else if (question.type === "checkbox-group") {
        if (formData.foodType.length === 0) errors.foodType = "Please select at least one food type.";
      } else if (question.type === "email") {
        if (!formData.email) {
          errors.email = "Email is required";
        } else if (!isValidEmail(formData.email)) {
          errors.email = "Invalid email format";
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

  const renderQuestion = (question) => {
    const showError = (fieldName) =>
      formErrors[fieldName] && <p className="text-red-500 text-sm text-black">{formErrors[fieldName]}</p>;

    if (question.name === "busyTimes") {
      return renderBusyTimesPoll();
    }
    if (question.type === "checkbox-group") {
      return (
        <div className="mb-4" key={question.name}>
          <label className="block text-gray-700 font-medium mb-2 text-black">{question.label}</label>
          <div>
            {question.options.map((option) => (
              <label key={option} className="inline-flex items-center mr-4 text-black">
                <input
                  type="checkbox"
                  name={option}
                  checked={formData.foodType.includes(option)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {showError("foodType")}
        </div>
      );
    } else if (question.type === "address") {
      return (
        <div className="mb-4" key={question.name}>
          <label className="block text-gray-700 font-medium mb-2 text-black">{question.label}</label>
          <div className="flex space-x-4">
            <div className="w-1/4">
              <input
                type="text"
                name="addressNumber"
                value={formData.addressNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Number/Area"
              />
              {showError("addressNumber")}
            </div>
            <div className="w-1/4">
              <input
                type="text"
                name="addressPostcode"
                value={formData.addressPostcode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Postcode"
              />
              {showError("addressPostcode")}
            </div>
            <div className="w-2/4">
              <input
                type="text"
                name="addressCity"
                value={formData.addressCity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="City"
              />
              {showError("addressCity")}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-4" key={question.name}>
          <label className="block text-gray-700 font-medium mb-2">{question.label}</label>
          <input
            type={question.type}
            name={question.name}
            value={formData[question.name]}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder={question.label}
          />
          {showError(question.name)}
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Registration Page</h1>
        {submissionSuccess && <p className="text-green-500 mb-4 text-center">Registration successful!</p>}
        <form onSubmit={handleSubmit}>
          {renderQuestion(questions[currentPage])}
          <div className="flex justify-between mt-4">
            {currentPage > 0 && (
              <button type="button" onClick={handlePrevious} className="px-4 py-2 bg-blue-500 text-white rounded">
                Previous
              </button>
            )}
            {currentPage < questions.length - 1 ? (
              <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
                Next
              </button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
