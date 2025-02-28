import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; 
import logger from '@/app/utils/logger';

export async function POST(request) {
  const startTime = performance.now();
  
  try {
    const formData = await request.json();

    const client = await clientPromise;
    const db = client.db('form-submission');

    const result = await db.collection('user-data').insertOne({
      ...formData,
      submittedAt: new Date(),
      status: 'submitted',
      metadata: {
        userAgent: request.headers.get('user-agent'),
        submittedAt: new Date().toISOString(),
        processingTime: (performance.now() - startTime).toFixed(2) + 'ms'
      }
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString(),
      processingTime: (performance.now() - startTime).toFixed(2) + 'ms',
      metadata: {
        collectionName: 'user-data',
        databaseName: 'form-submitions',
        documentCount: await db.collection('user-data').countDocuments()
      }
    });

  } catch (error) {
    logger.error(error, 'Submit Form API');
    const errorResponse = {
      success: false,
      message: 'Internal server error',
      processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
    };
    logger.performance('Form Submission', performance.now() - startTime);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}