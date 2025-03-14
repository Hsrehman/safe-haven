const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, min = 1, max = array.length) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomPhone() {
  const prefix = ['074', '075', '077', '078', '079'];
  return `${getRandomItem(prefix)}${Math.floor(10000000 + Math.random() * 90000000)}`;
}

function generateCoordinates(city) {
  const coordinates = {
    'London': { lat: 51.5074, lng: -0.1278 },
    'Manchester': { lat: 53.4808, lng: -2.2426 },
    'Birmingham': { lat: 52.4862, lng: -1.8904 },
    'Leeds': { lat: 53.8008, lng: -1.5491 },
    'Glasgow': { lat: 55.8642, lng: -4.2518 },
    'Liverpool': { lat: 53.4084, lng: -2.9916 },
    'Bristol': { lat: 51.4545, lng: -2.5879 },
    'Sheffield': { lat: 53.3811, lng: -1.4701 }
  };
  const base = coordinates[city];
  return {
    lat: base.lat + (Math.random() * 0.02 - 0.01),
    lng: base.lng + (Math.random() * 0.02 - 0.01)
  };
}

function generateRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createShelterRegistrations(count = 100) {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('shelterDB');

    const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Sheffield'];
    const streetPrefixes = ['High', 'Main', 'Church', 'Park', 'Station', 'Queen', 'King', 'Victoria', 'Albert', 'New'];
    const streetSuffixes = ['Street', 'Road', 'Avenue', 'Lane', 'Way', 'Close', 'Drive', 'Place'];

    
    const accommodationTypes = ['Dormitory/shared rooms', 'Single rooms', 'Self-contained units', 'Family rooms'];
    const operatingHours = ['24/7', 'Daytime Only (8AM-8PM)', 'Evening Only (6PM-9AM)', 'Custom Hours'];
    const maxStayLengths = [
      '1 night only',
      'Up to 7 nights',
      'Up to 28 days',
      'Up to 3 months',
      'Up to 6 months',
      'Up to 12 months',
      'More than 12 months',
      'No fixed limit'
    ];
    const accommodationTypeOptions = [
      'Emergency accommodation only',
      'Longer-term supported housing',
      'Both emergency and longer-term',
      'Transitional housing'
    ];
    const accessibilityFeatures = [
      'Wheelchair Accessible',
      'Ground Floor Access',
      'Elevator',
      'Accessible Bathrooms',
      'Visual Aids',
      'Hearing Aids'
    ];
    const genderPolicies = ['Men Only', 'Women Only', 'All Genders'];
    const petPolicies = ['No Pets Allowed', 'Service Animals Only', 'All Pets Welcome', 'Case by Case Basis'];
    const referralRoutes = [
      'Self-referrals accepted',
      'Local authority referrals only',
      'Agency referrals',
      'Housing Options/Council Homelessness Team referrals only'
    ];
    const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jewish'];
    const foodTypes = ['Vegetarian Only', 'Non-Vegetarian Only', 'Both Options Available', 'No food service provided'];
    const dietaryOptions = ['Halal', 'Kosher', 'Vegan', 'Gluten-free', 'Other allergies/requirements'];
    const additionalServices = [
      'Housing advice/resettlement support',
      'Benefits advice',
      'Employment support',
      'Access to GP/healthcare services',
      'Substance use support',
      'Mental health support',
      'Immigration advice (OISC registered)',
      'Meals',
      'Clothing',
      'Laundry facilities',
      'Internet access',
      'Storage Facilities'
    ];
    const specializedGroups = [
      'People fleeing domestic abuse',
      'Ex-offenders/prison leavers',
      'Veterans',
      'Care leavers',
      'People with substance use issues',
      'People with mental health needs',
      'Asylum seekers/refugees',
      'Young people (16-25)'
    ];

    for (let i = 0; i < count; i++) {
      const adminId = new ObjectId();
      const shelterId = new ObjectId();
      const city = getRandomItem(cities);
      const hasCustomHours = Math.random() > 0.8;
      const operatingHoursValue = hasCustomHours ? 'Custom Hours' : getRandomItem(operatingHours);
      const hasLimitedHolidays = Math.random() > 0.8;
      const openOnHolidaysValue = hasLimitedHolidays ? 'Limited hours (please specify)' : getRandomItem(['Yes', 'No']);
      const allowAllReligionsValue = Math.random() > 0.3;
      const hasMedical = Math.random() > 0.5;
      const hasMentalHealth = Math.random() > 0.5;
      const hasFamily = Math.random() > 0.5;
      const acceptNRPFValue = getRandomItem(['Yes', 'No', 'In certain circumstances (please specify)']);

      const adminDoc = {
        _id: adminId,
        email: `admin${i + 1}@shelter${i + 1}.org.uk`,
        adminName: `Admin ${i + 1}`,
        phone: generateRandomPhone(),
        shelterId,
        authProvider: 'email',
        isVerified: Math.random() > 0.5,
        registrationDate: new Date(),
        lastLogin: new Date(),
        password: await bcrypt.hash(`SecurePass${i + 1}!`, 10),
        twoFactorEnabled: false
      };

      const shelterDoc = {
        _id: shelterId,
        shelterName: `Shelter ${i + 1}`,
        organizationName: Math.random() > 0.5 ? `Organization ${i + 1}` : undefined,
        location: `${Math.floor(Math.random() * 200) + 1} ${getRandomItem(streetPrefixes)} ${getRandomItem(streetSuffixes)}, ${city}, UK`,
        location_coordinates: generateCoordinates(city),
        maxCapacity: String(Math.floor(Math.random() * 90) + 10),
        accommodationTypes: getRandomItems(accommodationTypes, 1, 3),
        operatingHours: operatingHoursValue,
        customHours: hasCustomHours ? '9AM-5PM Weekdays' : undefined,
        maxStayLength: getRandomItem(maxStayLengths),
        accommodationType: getRandomItem(accommodationTypeOptions),
        openOnHolidays: openOnHolidaysValue,
        holidayHours: hasLimitedHolidays ? '10AM-2PM' : undefined,
        accessibilityFeatures: getRandomItems(accessibilityFeatures, 0, 4),
        minAge: String(Math.floor(Math.random() * 40) + 12),
        maxAge: Math.random() > 0.7 ? String(Math.floor(Math.random() * 30) + 60) : undefined,
        genderPolicy: getRandomItem(genderPolicies),
        lgbtqFriendly: getRandomItem(['Yes', 'No']),
        hasFamily,
        maxFamilySize: hasFamily ? String(Math.floor(Math.random() * 8) + 2) : undefined,
        petPolicy: getRandomItem(petPolicies),
        homelessLinkRegistered: getRandomItem(['Yes', 'No', 'Registration in progress']),
        localAuthorityFunding: getRandomItem(['Yes', 'No', 'Partial funding']),
        housingJusticeMark: getRandomItem(['Yes', 'No', 'Applied but not yet received']),
        housingBenefitAccepted: getRandomItem(['Yes - full cost covered', 'Yes - with top-up payment', 'No']),
        serviceCharges: getRandomItem(['Yes', 'No']),
        weeklyCharge: String(generateRandomPrice(50, 500)),
        acceptNRPF: acceptNRPFValue,
        nrpfDetails: acceptNRPFValue === 'In certain circumstances (please specify)' ? 'With funding support' : undefined,
        localConnectionRequired: getRandomItem(['Yes - strict requirement', 'Preferred but not essential', 'No - we accept anyone']),
        referralRoutes: getRandomItems(referralRoutes, 1, 3),
        allowAllReligions: allowAllReligionsValue ? 'Yes' : 'No',
        allowedReligions: !allowAllReligionsValue ? getRandomItems(religions, 1, 3) : undefined,
        foodType: getRandomItem(foodTypes),
        dietaryOptions: getRandomItems(dietaryOptions, 0, 3),
        hasMedical: hasMedical ? 'Yes' : 'No',
        medicalDetails: hasMedical ? 'Weekly nurse visits' : undefined,
        hasMentalHealth: hasMentalHealth ? 'Yes' : 'No',
        mentalHealthDetails: hasMentalHealth ? 'Counselor available' : undefined,
        additionalServices: getRandomItems(additionalServices, 2, 6),
        specializedGroups: getRandomItems(specializedGroups, 1, 4),
        status: 'active',
        registrationDate: new Date(),
        isGoogleUser: false,
        authProvider: 'email',
        adminId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('adminUsers').insertOne(adminDoc);
      await db.collection('shelters').insertOne(shelterDoc);
      console.log(`Created shelter ${i + 1}: ${shelterDoc.shelterName}`);
    }

    console.log(`Successfully created ${count} shelter registrations`);
  } catch (error) {
    console.error('Error creating shelter registrations:', error);
  } finally {
    await client.close();
  }
}

createShelterRegistrations(100)
  .then(() => console.log('Script execution completed'))
  .catch(error => console.error('Script execution failed:', error));