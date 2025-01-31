export const OPTIONAL_FIELDS = {
    email: true,
    phone: true,
    fullName: true,
    medicalConditions: true,
    additionalInfo: true,
    gender: true,
    lgbtqFriendly: true,
    socialServices: true,
    mentalHealth: true
  };
  
  const VALIDATION_RULES = {
    text: value => value.length >= 2 && /^[A-Za-z\s-]{2,50}$/.test(value),
    address: value => value.length >= 2 && /^[A-Za-z0-9\s,.-]{2,100}$/.test(value),
    email: value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    tel: value => {
      const cleanPhone = value.replace(/[^0-9+]/g, '');
      return /^\+?[\d]{10,15}$/.test(cleanPhone);
    },
    date: value => {
      const date = new Date(value);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      return !isNaN(date) && date >= minDate && date <= maxDate;
    },
    select: value => value && value.trim().length > 0 && value !== 'Select...',
    number: value => {
      const num = Number(value);
      return !isNaN(num) && num > 0 && num <= 20;
    },
    checkbox: value => value === true,
    radio: value => value && value.trim().length > 0,
    textarea: value => !value || value.trim().length >= 10
  };
  
  const ERROR_MESSAGES = {
    text: 'Please enter valid text (letters only, minimum 2 characters)',
    address: 'Please enter a valid address (minimum 2 characters)',
    email: 'Please enter a valid email address (e.g., name@example.com)',
    tel: 'Please enter a valid phone number (10-15 digits)',
    date: 'Please enter a valid date (must be between 16-100 years old)',
    select: 'Please select an option from the list',
    number: 'Please enter a valid number between 1 and 20',
    checkbox: 'You must accept the terms to continue',
    radio: 'Please select an option',
    textarea: 'Please provide more details (minimum 10 characters)',
    required: 'This field is required'
  };
  
  export const validateField = (field, value, formData = {}) => {
    if (field.type === 'compound') {
      const mainValue = formData[field.subQuestions[0].id];
      const countValue = formData[field.subQuestions[1].id];
      

      if (!mainValue) {
        return { isValid: false, error: ERROR_MESSAGES.required };
      }
      

      if (mainValue === 'Yes' && (!countValue || countValue <= 0 || countValue > 20)) {
        return { isValid: false, error: ERROR_MESSAGES.number };
      }
      
      return { isValid: true };
    }
  
    const isRequired = !OPTIONAL_FIELDS[field.id];
    
    if (!value && !isRequired) return { isValid: true };
    if (!value && isRequired) return { isValid: false, error: ERROR_MESSAGES.required };
    
    const validationRule = VALIDATION_RULES[field.type];
    if (!validationRule) return { isValid: true };
    
    const isValid = validationRule(value);
    return {
      isValid,
      error: isValid ? null : ERROR_MESSAGES[field.type]
    };
  };
  
  export const validateForm = (formData, questions) => {
    const errors = {};
    
    questions.forEach(question => {
      if (question.type === 'compound') {
        const mainValue = formData[question.subQuestions[0].id];
        const validation = validateField({
          id: question.subQuestions[0].id,
          type: 'radio'
        }, mainValue);
        
        if (!validation.isValid) {
          errors[question.subQuestions[0].id] = validation.error;
        }
        
        if (mainValue === 'Yes') {
          const countValue = formData[question.subQuestions[1].id];
          const countValidation = validateField({
            id: question.subQuestions[1].id,
            type: 'number'
          }, countValue);
          
          if (!countValidation.isValid) {
            errors[question.subQuestions[1].id] = countValidation.error;
          }
        }
        return;
      }
  
      const validation = validateField(question, formData[question.id]);
      if (!validation.isValid) {
        errors[question.id] = validation.error;
      }
    });
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };