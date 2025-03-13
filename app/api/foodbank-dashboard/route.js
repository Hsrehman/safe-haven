import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const GET = async () => {
    try {
        const client = await clientPromise;
        const db = client.db("safe-haven");
        const reviews = db.collection("foodbank_reviews");
        const polls = db.collection("foodbank_polls");

        const [recentReviews, activePolls] = await Promise.all([
            reviews.find({}).sort({ createdAt: -1 }).limit(10).toArray(),
            polls.find({ status: "active" }).toArray()
        ]);

        return NextResponse.json({
            success: true,
            reviews: recentReviews,
            polls: activePolls
        });
    } catch (error) {
        console.error("Foodbank Dashboard GET Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

export const POST = async (request) => {
    try {
        const client = await clientPromise;
        const db = client.db("safe-haven");
        const reviews = db.collection("foodbank_reviews");
        const pollResponses = db.collection("foodbank_poll_responses");

        const data = await request.json();
        const { action } = data;

        switch (action) {
            case "submitReview":
                const { text, rating } = data;
                await reviews.insertOne({
                    text,
                    rating: parseInt(rating),
                    createdAt: new Date()
                });
                return NextResponse.json({
                    success: true,
                    message: "Review submitted successfully"
                });

            case "submitPoll":
                const { pollId, option } = data;
                await pollResponses.insertOne({
                    pollId,
                    selectedOption: option,
                    createdAt: new Date()
                });
                return NextResponse.json({
                    success: true,
                    message: "Poll response submitted successfully"
                });

            default:
                return NextResponse.json(
                    { success: false, message: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Foodbank Dashboard Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}