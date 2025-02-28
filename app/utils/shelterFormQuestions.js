export const shelterFormQuestions = [
  {
    id: 'adminName',
    question: 'What is your full name?',
    type: 'text',
    placeholder: 'Enter your name',
    required: true
  },
  {
    id: 'email',
    question: 'What is your email address?',
    type: 'email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    id: 'password',
    question: 'Choose a password ',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  },
  {
    id: 'shelterName',
    question: 'What is the name of your shelter?',
    type: 'text',
    placeholder: 'Enter shelter name',
    required: true
  },
  {
    id: 'organizationName',
    question: 'What organization does your shelter belong to? (if any)',
    type: 'text',
    placeholder: 'Enter organization name'
  },
  {
    id: 'location',
    question: 'What is the shelter\'s address?',
    type: 'address',
    placeholder: 'Enter shelter address',
    required: true
  },
  {
    id: 'phone',
    question: 'What is your contact phone number?',
    type: 'tel',
    placeholder: 'Enter phone number',
    required: true
  },
  {
    id: 'maxCapacity',
    question: 'What is your maximum capacity?',
    type: 'number',
    placeholder: 'Enter maximum number of residents',
    required: true
  },
  {
    id: 'operatingHours',
    question: 'What are your operating hours?',
    type: 'select',
    options: ['24/7', 'Daytime Only (8AM-8PM)', 'Evening Only (6PM-9AM)', 'Custom Hours'],
    required: true
  },
  {
    id: 'customHours',
    question: 'Please specify your custom hours',
    type: 'textarea',
    placeholder: 'Describe your operating hours'
  },
  {
    id: 'genderPolicy',
    question: 'What is your gender acceptance policy?',
    type: 'select',
    options: ['Men Only', 'Women Only', 'All Genders'],
    required: true
  },
  {
    id: 'lgbtqFriendly',
    question: 'Is your shelter LGBTQ+ friendly?',
    type: 'radio',
    options: ['Yes', 'No'],
    required: true
  },
  {
    id: 'acceptsFamilies',
    question: 'Do you accommodate families?',
    type: 'compound',
    subQuestions: [
      { id: 'hasFamily', type: 'radio', options: ['Yes', 'No'] },
      { id: 'maxFamilySize', type: 'number', placeholder: 'Maximum family size' }
    ],
    required: true
  },
  {
    id: 'petPolicy',
    question: 'What is your pet policy?',
    type: 'select',
    options: ['No Pets', 'Service Animals Only', 'All Pets Welcome', 'Case by Case'],
    required: true
  },
  {
    id: 'accessibilityFeatures',
    question: 'What accessibility features do you have?',
    type: 'checkbox-group',
    options: [
      'Wheelchair Accessible',
      'Ground Floor Access',
      'Elevator',
      'Accessible Bathrooms',
      'Visual Aids',
      'Hearing Aids'
    ]
  },
  {
    id: 'medicalSupport',
    question: 'Do you provide medical support?',
    type: 'compound',
    required: true,
    subQuestions: [
      { id: 'hasMedical', type: 'radio', options: ['Yes', 'No'] },
      { id: 'medicalDetails', type: 'textarea', placeholder: 'Describe available medical services' }
    ]
  },
  {
    id: 'mentalHealthSupport',
    question: 'Do you provide mental health support?',
    type: 'compound',
    required: true,
    subQuestions: [
      { id: 'hasMentalHealth', type: 'radio', options: ['Yes', 'No'] },
      { id: 'mentalHealthDetails', type: 'textarea', placeholder: 'Describe mental health services' }
    ]
  },
  {
    id: 'additionalServices',
    question: 'What additional services do you provide?',
    type: 'checkbox-group',
    options: [
      'Meals',
      'Clothing',
      'Job Placement',
      'Educational Programs',
      'Financial Advice',
      'Legal Aid',
      'Transportation',
      'Storage Facilities'
    ]
  },
  {
    id: 'terms',
    question: 'Terms and Conditions',
    type: 'checkbox',
    label: 'I agree to the terms and conditions',
    required: true
  }
];