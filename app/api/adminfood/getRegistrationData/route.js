// app/api/adminfood/getRegistrationData/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ 
                success: false, 
                message: "Email is required" 
            });
        }

        const client = await clientPromise;
        
        // Get user data from adminfood_users collection
        const authDb = client.db("adminfood_users");
        const authUser = await authDb.collection("adminfood_users").findOne({ email });

        if (!authUser) {
            return NextResponse.json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Get registration data from adminfoods collection
        const regDb = client.db("test");
        const regData = await regDb.collection("adminfoods").findOne({ email });

        if (!regData) {
            return NextResponse.json({ 
                success: false, 
                message: "Registration data not found" 
            });
        }

        // Combine the data
        const userData = {
            ...regData,
            charityName: authUser.charityName,
            role: authUser.role
        };

        return NextResponse.json({
            success: true,
            userData
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}