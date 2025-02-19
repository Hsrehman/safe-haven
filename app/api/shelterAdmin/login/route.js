import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
      const { email, password } = await request.json();
  
      if (!email || !password) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing email or password",
          },
          { status: 400 }
        );
      }
  
      const client = await clientPromise;
      const db = client.db("shelterDB");
      const user = await db.collection("adminUsers").findOne({ email });
  
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials",
          },
          { status: 401 }
        );
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials",
          },
          { status: 401 }
        );
      }
  
      if (!user.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Email not verified",
          },
          { status: 403 }
        );
      }
  
      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      return NextResponse.json({
        success: true,
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error("[Login Error]:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "An unexpected error occurred. Please try again later.",
        },
        { status: 500 }
      );
    }
  }