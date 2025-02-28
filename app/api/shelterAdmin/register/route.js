import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { TokenManager } from "@/lib/auth/tokenManager";
import logger from "@/app/utils/logger";
import { sanitizeData } from "@/app/utils/sanitizer";

export async function POST(request) {
  try {
    const shelterData = await request.json();
    const client = await clientPromise;
    const db = client.db("shelterDB");

    
    const existingUser = await db.collection("adminUsers").findOne({ email: shelterData.email });
    
    if (existingUser) {
      
      if (shelterData.isGoogleUser && existingUser.authProvider !== 'google') {
        return NextResponse.json({ 
          success: false, 
          message: "Email already registered with a different method" 
        }, { status: 400 });
      }
      
      if (!shelterData.isGoogleUser) {
        return NextResponse.json({ 
          success: false, 
          message: "Email already exists" 
        }, { status: 400 });
      }
    }

    const shelterDoc = {
      shelterName: shelterData.shelterName,
      location: { address: shelterData.location, coordinates: shelterData.location_coordinates },
      phone: shelterData.phone,
      maxCapacity: parseInt(shelterData.maxCapacity),
      operatingHours: shelterData.operatingHours,
      genderPolicy: shelterData.genderPolicy,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      capacity: { maximum: parseInt(shelterData.maxCapacity), current: 0, available: parseInt(shelterData.maxCapacity) }
    };
    const shelterResult = await db.collection("shelters").insertOne(shelterDoc);

    const adminDoc = {
      email: shelterData.email,
      adminName: shelterData.adminName || shelterData.name,
      shelterId: shelterResult.insertedId,
      isVerified: shelterData.isGoogleUser || false,
      authProvider: shelterData.isGoogleUser ? 'google' : 'email',
      createdAt: new Date()
    };

    if (!shelterData.isGoogleUser) {
      adminDoc.password = await bcrypt.hash(shelterData.password, 10);
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      adminDoc.verificationToken = verificationToken;

      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_PASS }
      });
      await transporter.sendMail({
        from: "verify.safehaven@gmail.com",
        to: shelterData.email,
        subject: "Verify Your Shelter Account",
        html: `<p>Hello ${shelterData.adminName},</p><p>Your verification code is: <strong>${verificationToken}</strong></p>`
      });
    }

    const adminResult = await db.collection("adminUsers").insertOne(adminDoc);

    if (shelterData.isGoogleUser) {
      const tokenPayload = {
        _id: adminResult.insertedId,
        email: adminDoc.email,
        adminName: adminDoc.adminName,
        shelterId: adminDoc.shelterId,
        isVerified: true,
        authProvider: 'google'
      };

      logger.dev('Registration process:', sanitizeData({ tokenPayload }));

      const { accessToken, refreshToken } = TokenManager.generateTokens(tokenPayload);
      
      const response = NextResponse.json({ 
        success: true, 
        message: "Registration successful",
        redirect: '/shelterPortal/dashboard'
      });
      
      return TokenManager.setAuthCookies(response, accessToken, refreshToken);
    }

    return NextResponse.json({ success: true, message: "Registered, verify email" });
  } catch (error) {
    logger.error(error, 'Registration API');
    return NextResponse.json({ 
      success: false, 
      message: "Registration failed" 
    }, { status: 500 });
  }
}