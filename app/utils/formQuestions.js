// formQuestions.js
export const formQuestions = [
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