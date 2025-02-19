export const OPTIONAL_FIELDS = {
    organizationName: true,
    customHours: true,
    additionalInfo: true,
    otherLanguages: true,
    medicalDetails: true,
    mentalHealthDetails: true,
    curfewDetails: true,
    ageDetails: true,
  };
  
  const VALIDATION_RULES = {
    text: value => value.length >= 2 && /^[A-Za-z\s-]{2,50}$/.test(value),
    address: value => value && value.trim().length > 0,
    email: value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    tel: value => {
      const cleanPhone = value.replace(/[^0-9+]/g, '');
      return /^\+?[\d]{10,15}$/.test(cleanPhone);
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
    tel: 'Please enter a valid phone number (10-15 digits)',
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
  
      if (mainValue === 'Yes' && !subValue) {
        return { isValid: false, error: ERROR_MESSAGES[field.subQuestions[1].type] };
      }
  
      return { isValid: true };
    }
  
    const isRequired = field.required && !OPTIONAL_FIELDS[field.id];
  
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