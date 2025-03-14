import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
    const startTime = performance.now();
    try {
        const { formData, formId } = await request.json();
        if (!formData || Object.keys(formData).length === 0) {
            return NextResponse.json({ success: false, message: "Form data required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("form-submission");

        let result;
        if (formId) {
            
            result = await db.collection("user-data").updateOne(
                { _id: new ObjectId(formId) },
                {
                    $set: {
                        ...formData,
                        lastUpdated: new Date(),
                        status: "updated"
                    }
                }
            );

            if (result.matchedCount === 0) {
                return NextResponse.json({
                    success: false,
                    message: "Form not found",
                    processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                id: formId,
                message: "Form updated successfully",
                processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
            });
        } else {
            
            result = await db.collection("user-data").insertOne({
                ...formData,
                submittedAt: new Date(),
                lastUpdated: new Date(),
                status: "submitted"
            });

            return NextResponse.json({
                success: true,
                id: result.insertedId.toString(),
                message: "Form submitted successfully",
                processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
            });
        }
    } catch (error) {
        console.error('Form submission error:', error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
        }, { status: 500 });
    }
}