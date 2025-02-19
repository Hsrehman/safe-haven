import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  const startTime = performance.now();
  
  try {
    const shelterData = await request.json();

    const client = await clientPromise;
    const db = client.db('shelterDB');

    const shelterDocument = {
      ...shelterData,
      registeredAt: new Date(),
      status: 'pending', 
      accountStatus: 'active',
      metadata: {
        userAgent: request.headers.get('user-agent'),
        submittedAt: new Date().toISOString(),
        processingTime: (performance.now() - startTime).toFixed(2) + 'ms',
        lastUpdated: new Date().toISOString()
      },

      location: {
        address: shelterData.location?.address || shelterData.location, 
        coordinates: shelterData.location?.coordinates || shelterData.location_coordinates, 
        type: "Point"
      },
      

      services: {
        medical: {
          available: shelterData.hasMedical === 'Yes',
          details: shelterData.medicalDetails || null
        },
        mentalHealth: {
          available: shelterData.hasMentalHealth === 'Yes',
          details: shelterData.mentalHealthDetails || null
        },
        additionalServices: shelterData.additionalServices || []
      },

      policies: {
        gender: shelterData.genderPolicy,
        lgbtqFriendly: shelterData.lgbtqFriendly === 'Yes',
        families: {
          accepted: shelterData.hasFamily === 'Yes',
          maxSize: parseInt(shelterData.maxFamilySize) || 0
        },
        pets: shelterData.petPolicy,
        smoking: shelterData.smokingPolicy
      },

      capacity: {
        maximum: parseInt(shelterData.maxCapacity),
        current: parseInt(shelterData.currentCapacity) || parseInt(shelterData.maxCapacity),
        available: parseInt(shelterData.maxCapacity) - (parseInt(shelterData.currentCapacity) || 0)
      },

      operatingHours: {
        type: shelterData.operatingHours,
        custom: shelterData.operatingHours === 'Custom Hours' ? shelterData.customHours : null
      },
      accessibility: shelterData.accessibilityFeatures || []
    };


    await db.collection('shelters').createIndex({ "location.coordinates": "2dsphere" });


    const result = await db.collection('shelters').insertOne(shelterDocument);

    return NextResponse.json({
      success: true,
      shelterId: result.insertedId,
      message: 'Shelter registration submitted successfully',
      timestamp: new Date().toISOString(),
      processingTime: (performance.now() - startTime).toFixed(2) + 'ms',
      metadata: {
        collectionName: 'shelters',
        databaseName: 'shelterDB',
        documentCount: await db.collection('shelters').countDocuments()
      }
    });

  } catch (error) {
    console.error('[Shelter Registration Error]:', {
      message: error.message,
      timestamp: new Date().toISOString(),
      processingTime: (performance.now() - startTime).toFixed(2) + 'ms'
    });
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to register shelter',
        error: error.message,
        timestamp: new Date().toISOString(),
        processingTime: (performance.now() - startTime).toFixed(2) + 'ms'
      },
      { status: 500 }
    );
  }
}