import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      console.error("[Email Verification Error]:", "Missing email or token");
      return NextResponse.json(
        {
          success: false,
          message: "Missing email or token",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("shelterDB");

    const user = await db.collection("adminUsers").findOne({
      email: email,
      verificationToken: token,
    });

    if (!user) {
      console.error("[Email Verification Error]:", "Invalid email or token");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or token",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    await db.collection("adminUsers").updateOne(
      { email: email },
      {
        $set: { isVerified: true },
        $unset: { verificationToken: "" },
      }
    );

    console.log("[Email Verification Success]:", `Email ${email} verified`);
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Email Verification Error]:", {
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify email",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}