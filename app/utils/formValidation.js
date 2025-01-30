

export const isOptional = (questionId) => {
    return ['email', 'phone', 'fullName', 'medicalConditions', 'additionalInfo', 'gender'].includes(questionId);
  };
  
  export const validateField = (type, value, required = true) => {
    if (!required && !value) return true;
    if (required && !value) return false;
    
    switch (type) {
      case 'text':
        return value.length >= 2 && /^[A-Za-z\s-]{2,50}$/.test(value);

        case 'address': // New type for address fields
      return value.length >= 2 && /^[A-Za-z0-9\s,.-]{2,100}$/.test(value);
      
      case 'email':
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      
      case 'tel':
        const cleanPhone = value.replace(/[^0-9+]/g, '');
        return /^\+?[\d]{10,15}$/.test(cleanPhone);
      
      case 'date':
        const date = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 100);
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() - 16);
        return !isNaN(date) && date >= minDate && date <= maxDate;
      
      case 'select':
        return value && value.trim().length > 0 && value !== 'Select...';
      
      case 'number':
        const num = Number(value);
        return !isNaN(num) && num > 0 && num <= 20;
      
      case 'checkbox':
        return value === true;
      
      case 'radio':
        return value && value.trim().length > 0;
      
      case 'textarea':
        return !required || (value && value.trim().length >= 10);
      
      default:
        return !!value;
    }
  };
  
  export const getErrorMessage = (type, fieldName) => {
    switch (type) {
      case 'text':
        return 'Please enter valid text (letters only, minimum 2 characters)';

        case 'address':
          return 'Please enter a valid address atleast 2 characters';
      
      case 'email':
        return 'Please enter a valid email address (e.g., name@example.com)';
      
      case 'tel':
        return 'Please enter a valid phone number (10-15 digits)';
      
      case 'date':
        return 'Please enter a valid date (must be between 16-100 years old)';
      
      case 'select':
        return 'Please select an option from the list';
      
      case 'number':
        return 'Please enter a valid number between 1 and 20';
      
      case 'checkbox':
        return 'You must accept the terms to continue';
      
      case 'radio':
        return 'Please select an option';
      
      case 'textarea':
        return 'Please provide more details (minimum 10 characters)';
      
      default:
        return `${fieldName} is required`;
    }
  };
  
  export const validateOnChange = (question, value) => {
    if (!value && !isOptional(question.id)) {
      return {
        isValid: false,
        error: 'This field is required'
      };
    } else if (value) {
      const isValid = validateField(question.type, value);
      if (!isValid) {
        return {
          isValid: false,
          error: getErrorMessage(question.type, question.question)
        };
      }
    }
    return { isValid: true, error: null };
  };
  
  export const validateOnBlur = (question, value) => {
    if (!isOptional(question.id)) {
      const isValid = validateField(question.type, value, true);
      if (!isValid) {
        return {
          isValid: false,
          error: getErrorMessage(question.type, question.question)
        };
      }
    }
    return { isValid: true, error: null };
  };
  
  export const validateCurrentQuestion = (currentQuestion, answer) => {
    if (!currentQuestion) return { isValid: true, error: null };
    
    if (!isOptional(currentQuestion.id) && !answer) {
      return {
        isValid: false,
        error: 'This field is required'
      };
    }
  
    if (answer) {
      const isValid = validateField(currentQuestion.type, answer);
      if (!isValid) {
        return {
          isValid: false,
          error: getErrorMessage(currentQuestion.type, currentQuestion.question)
        };
      }
    }
  
    return { isValid: true, error: null };
  };
  
  export const validateForm = (formData, questions) => {
    const errors = {};
    let isValid = true;
  
    questions.forEach(question => {
      const value = formData[question.id];
      if (!validateField(question.type, value)) {
        errors[question.id] = getErrorMessage(question.type, question.question);
        isValid = false;
      }
    });
  
    return { isValid, errors };
  };