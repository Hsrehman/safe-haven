import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { action, email, password, fullName } = await request.json();
    const client = await clientPromise;
    const db = client.db("safe-haven");
    const users = db.collection("users");

    if (action === "register") {
      // Check if user already exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 400 }
        );
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      await users.insertOne({
        fullName,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "Registration successful",
      });
    }

    if (action === "login") {
      const user = await users.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}