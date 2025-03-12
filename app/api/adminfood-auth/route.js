import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { action, email, password, charityName } = await request.json();
        
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("adminfood_users"); // Your shared database name
        const collection = db.collection("adminfood_users"); // Collection specific to adminfood

        switch (action) {
            case "register":
                // Check if user already exists
                const existingUser = await collection.findOne({
                    $or: [{ email }, { charityName }]
                });

                if (existingUser) {
                    return NextResponse.json(
                        { success: false, message: "Email or charity name already registered" },
                        { status: 400 }
                    );
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create new user
                await collection.insertOne({
                    charityName,
                    email,
                    password: hashedPassword,
                    role: "adminfood",
                    createdAt: new Date()
                });

                return NextResponse.json({
                    success: true,
                    message: "Registration successful"
                });

            case "login":
                // Find user by email
                const loginUser = await collection.findOne({ 
                    email,
                    role: "adminfood" // Ensure we're only finding adminfood users
                });

                if (!loginUser) {
                    return NextResponse.json(
                        { success: false, message: "User is not registered" },
                        { status: 401 }
                    );
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(password, loginUser.password);

                if (!isPasswordValid) {
                    return NextResponse.json(
                        { success: false, message: "Invalid email or password" },
                        { status: 401 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    user: {
                       
                        email: loginUser.email,
                        role: loginUser.role
                    }
                });

            case "forgotPassword":
                const userExists = await collection.findOne({ 
                    email,
                    role: "adminfood"
                });

                if (!userExists) {
                    return NextResponse.json(
                        { success: false, message: "Email not found" },
                        { status: 404 }
                    );
                }

                // Here you would typically:
                // 1. Generate a reset token
                // 2. Save it to the database
                // 3. Send an email with reset link
                return NextResponse.json({
                    success: true,
                    message: "Password reset instructions sent to your email"
                });

            default:
                return NextResponse.json(
                    { success: false, message: "Invalid action" },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error("Adminfood Auth API Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
      success: true,
      message: "This is the adminfood-auth API. Use POST requests to interact with it.",
    });
  }