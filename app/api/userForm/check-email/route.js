import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email?.trim()) return NextResponse.json({ available: false, message: "Email required" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("form-submission");
        const exists = await db.collection("user-data").findOne({ email });
        return NextResponse.json({ available: !exists, message: exists ? "Email already exists" : "Email available" });
    } catch (error) {
        return NextResponse.json({ available: false, message: "Server error" }, { status: 500 });
    }
}