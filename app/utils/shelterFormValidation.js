const VALIDATION_RULES = {
  text: value => typeof value === 'string' && value.length >= 2 && /^[A-Za-z\s-]{2,50}$/.test(value),
  address: (value, formData) => {
    if (typeof value === 'object' && value !== null) {
      return (
        typeof value.address === 'string' &&
        value.address.trim().length > 0 &&
        formData.location_coordinates &&
        typeof formData.location_coordinates.lat === 'number' &&
        typeof formData.location_coordinates.lng === 'number'
      );
    }
    return (
      typeof value === 'string' &&
      value.trim().length > 0 &&
      formData.location_coordinates &&
      typeof formData.location_coordinates.lat === 'number' &&
      typeof formData.location_coordinates.lng === 'number'
    );
  },
  email: value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
  password: value => {
    const hasMinLength = /.{8,}/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*]/.test(value);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
  },
  tel: value => {
    
    const cleanPhone = value.replace(/\D/g, '');
    
    
    return /^07[1-9]\d{8}$/.test(cleanPhone);
  },
  number: value => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  },
  select: value => value && value.trim().length > 0 && value !== 'Select...',
  checkbox: value => value === true,
  radio: value => value && value.trim().length > 0,
  textarea: value => !value || value.trim().length >= 10,
  'checkbox-group': value => Array.isArray(value) && value.length > 0,
};

const ERROR_MESSAGES = {
  text: 'Please enter valid text (letters only, minimum 2 characters)',
  address: 'Please select a valid address from the suggestions',
  email: 'Please enter a valid email address',
  password: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (!@#$%^&*)',
  tel: 'Please enter a valid UK mobile number (11 digits starting with 07)',
  number: 'Please enter a valid number greater than 0',
  select: 'Please select an option',
  checkbox: 'You must accept the terms to continue',
  radio: 'Please select an option',
  textarea: 'Please provide more details (minimum 10 characters)',
  'checkbox-group': 'Please select at least one option',
  required: 'This field is required'
};

export const validateField = (field, value, formData = {}) => {
  if (field.type === 'compound') {
    const mainValue = formData[field.subQuestions[0].id];
    const subValue = formData[field.subQuestions[1].id];

    
    if (!mainValue) {
      return { isValid: false, error: ERROR_MESSAGES.required };
    }

    
    if (mainValue === 'Yes') {
      
      if (field.subQuestions[1].type === 'number') {
        if (!subValue || isNaN(subValue) || subValue <= 0) {
          return { isValid: false, error: ERROR_MESSAGES.number };
        }
      }
      
      else if (field.subQuestions[1].type === 'textarea') {
        if (!subValue || subValue.trim().length < 10) {
          
          let errorMessage = 'Please provide more details (minimum 10 characters)';
          if (field.id === 'medicalSupport') {
            errorMessage = 'Please describe the medical services provided (minimum 10 characters)';
          } else if (field.id === 'mentalHealthSupport') {
            errorMessage = 'Please describe the mental health services provided (minimum 10 characters)';
          }
          return { isValid: false, error: errorMessage };
        }
      }
    }

    return { isValid: true };
  }

  const isRequired = field.required;
  if (!value && !isRequired) return { isValid: true };
  if (!value && isRequired) return { isValid: false, error: ERROR_MESSAGES.required };

  const validationRule = VALIDATION_RULES[field.type];
  if (!validationRule) return { isValid: true };

  const isValid = validationRule(value, formData);
  return {
    isValid,
    error: isValid ? null : ERROR_MESSAGES[field.type]
  };
};

export const validateForm = (formData, questions) => {
  const errors = {};
  let isValid = true;

  questions.forEach(question => {
    const validation = validateField(question, formData[question.id], formData);
    if (!validation.isValid) {
      errors[question.id] = validation.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};