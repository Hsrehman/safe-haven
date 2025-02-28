import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    const startTime = performance.now();
    try {
        const formData = await request.json();
        if (!formData || Object.keys(formData).length === 0) {
            return NextResponse.json({ success: false, message: "Form data required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("form-submission"); 
        const result = await db.collection("user-data").insertOne({
            ...formData,
            submittedAt: new Date(),
            status: "submitted"
        });

        return NextResponse.json({
            success: true,
            id: result.insertedId,
            message: "Form submitted successfully",
            processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
        }, { status: 500 });
    }
}