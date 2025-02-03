import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; 
export async function POST(request) {
  try {
    let formData;
    try {
      formData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("safe-haven");

    const result = await db.collection("submissions").insertOne({
      ...formData,
      submittedAt: new Date(),
      status: "submitted",
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
