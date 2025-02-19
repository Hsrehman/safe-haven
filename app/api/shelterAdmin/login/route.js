import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      console.error("[Login Error]:", "Missing email or password");
      return NextResponse.json(
        {
          success: false,
          message: "Missing email or password",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("shelterDB");

    const user = await db.collection("adminUsers").findOne({ email: email });

    if (!user) {
      console.error("[Login Error]:", "Invalid credentials");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.error("[Login Error]:", "Invalid credentials");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      console.error("[Login Error]:", "Email not verified");
      return NextResponse.json(
        {
          success: false,
          message: "Email not verified",
          timestamp: new Date().toISOString(),
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

    console.log("[Login Success]:", `User ${email} logged in`);
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token: token,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Login Error]:", {
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}