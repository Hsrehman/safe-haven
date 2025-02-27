// app/api/adminfoodregistration-auth/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import AdminFood from '@/app/adminfood/backend/AdminFood';

export async function POST(request) {
  try {
    console.log('API endpoint hit');
    await dbConnect();
    console.log('Database connected');

    const data = await request.json();
    console.log('Received data:', data);

    // Format location data to ensure it's properly structured
    let formattedData = { ...data };
    
    // Handle location data
    if (data.location) {
      // Convert string values to numbers if they exist but are strings
      if (data.location.latitude && typeof data.location.latitude === 'string') {
        formattedData.location.latitude = parseFloat(data.location.latitude);
      }
      
      if (data.location.longitude && typeof data.location.longitude === 'string') {
        formattedData.location.longitude = parseFloat(data.location.longitude);
      }
      
      // Ensure other location fields are strings
      if (data.location.formattedAddress) {
        formattedData.location.formattedAddress = String(data.location.formattedAddress);
      }
      
      if (data.location.dmsNotation) {
        formattedData.location.dmsNotation = String(data.location.dmsNotation);
      }
    }
    
    console.log('Formatted data:', formattedData);

    const adminFood = await AdminFood.create(data);

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      data: adminFood 
    }, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Registration failed'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}