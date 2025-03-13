import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const POST = async (request) => {
    try {
        const client = await clientPromise;
        const db = client.db("safe-haven");
        const polls = db.collection("foodbank_polls");

        const data = await request.json();
        const { action, question, options, status } = data;

        if (action === 'createPoll') {
            const result = await polls.insertOne({
                question,
                options,
                status,
                createdAt: new Date()
            });

            return NextResponse.json({
                success: true,
                message: "Poll created successfully",
                pollId: result.insertedId
            });
        }

        return NextResponse.json(
            { success: false, message: "Invalid action" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Polls Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}