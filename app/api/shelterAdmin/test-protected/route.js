
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      return NextResponse.json({
        success: true,
        message: "Protected route accessed successfully",
        user: {
          userId: decoded.userId,
          email: decoded.email
        }
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Protected route error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}