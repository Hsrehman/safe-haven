import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
      const { firstName, lastName, email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db("safe-haven");
    const users = db.collection("users");

    if (!firstName || !lastName || !email || !password) {
        return NextResponse.json(
          { success: false, message: "All fields are required" },
          { status: 400 }
        );
      }

      const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "Registration successful",
        userId: result.insertedId,
      });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json(
          { success: false, message: "Registration failed" },
          { status: 500 }
        );
      }
    }