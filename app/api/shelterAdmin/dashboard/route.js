import { NextResponse } from 'next/server';
import logger from '@/app/utils/logger';
import { sanitizeData } from '@/app/utils/sanitizer';

export async function GET(request) {
  try {
    logger.dev('Dashboard API Request');
    
    
    const headers = {
      userId: request.headers.get('X-User-Id'),
      shelterId: request.headers.get('X-Shelter-Id'),
      userRole: request.headers.get('X-User-Role'),
      isVerified: request.headers.get('X-Is-Verified') === 'true',
      adminName: request.headers.get('X-Admin-Name')
    };
    
    logger.dev('Headers received:', sanitizeData(headers));
    
    if (!headers.userId || !headers.shelterId) {
      logger.dev('Missing required headers');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    
    return NextResponse.json({
      success: true,
      data: {
        message: `Welcome to your dashboard, ${headers.adminName || 'Admin'}!`,
        user: {
          id: headers.userId,
          shelterId: headers.shelterId,
          role: headers.userRole || 'admin',
          isVerified: headers.isVerified,
          adminName: headers.adminName
        }
      }
    });
  } catch (error) {
    logger.error(error, 'Dashboard API');
    return NextResponse.json({
      success: false,
      message: "Error fetching dashboard data"
    }, { status: 500 });
  }
}