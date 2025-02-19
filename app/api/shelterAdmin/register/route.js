import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validateForm } from "@/app/utils/shelterFormValidation";
import validator from 'validator';
import nodemailer from 'nodemailer';
import { shelterFormQuestions } from "@/app/utils/shelterFormQuestions";

export async function POST(request) {
  const startTime = performance.now();

  try {
    const shelterData = await request.json();


    const { isValid, errors } = validateForm(
      shelterData,
      shelterFormQuestions
    );

    if (!isValid) {
      console.error("[Validation Failed]:", errors);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: errors,
          timestamp: new Date().toISOString(),
          processingTime: (performance.now() - startTime).toFixed(2) + "ms",
        },
        { status: 400 }
      );
    }


    for (const key in shelterData) {
      if (typeof shelterData[key] === 'string') {
        shelterData[key] = validator.escape(shelterData[key]);
      }
    }

    const client = await clientPromise;
    const db = client.db("shelterDB");

   
    const temporaryPassword = crypto.randomBytes(20).toString("hex");

    
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

   
    const adminUser = {
      email: shelterData.email,
      password: hashedPassword,
      shelterId: null, 
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const shelterDocument = {
      ...shelterData,
      registeredAt: new Date(),
      status: "pending",
      accountStatus: "active",
      metadata: {
        userAgent: request.headers.get("user-agent"),
        submittedAt: new Date().toISOString(),
        processingTime: (performance.now() - startTime).toFixed(2) + "ms",
        lastUpdated: new Date().toISOString(),
      },

      
      

      services: {
        medical: {
          available: shelterData.hasMedical === "Yes",
          details: shelterData.medicalDetails || null,
        },
        mentalHealth: {
          available: shelterData.mentalHealthDetails || null,
        },
        additionalServices: shelterData.additionalServices || [],
      },

      policies: {
        gender: shelterData.genderPolicy,
        lgbtqFriendly: shelterData.lgbtqFriendly === "Yes",
        families: {
          accepted: shelterData.hasFamily === "Yes",
          maxSize: parseInt(shelterData.maxFamilySize) || 0,
        },
        pets: shelterData.petPolicy,
        smoking: shelterData.smokingPolicy,
      },

      capacity: {
        maximum: parseInt(shelterData.maxCapacity),
        current:
          parseInt(shelterData.currentCapacity) ||
          parseInt(shelterData.maxCapacity),
        available:
          parseInt(shelterData.maxCapacity) -
          (parseInt(shelterData.currentCapacity) || 0),
      },

      operatingHours: {
        type: shelterData.operatingHours,
        custom:
          shelterData.operatingHours === "Custom Hours"
            ? shelterData.customHours
            : null,
      },
      accessibility: shelterData.accessibilityFeatures || [],
    };

    await db
      .collection("shelters")
      .createIndex({ "location.coordinates": "2dsphere" });

    const result = await db.collection("shelters").insertOne(shelterDocument);


    adminUser.shelterId = result.insertedId;
    await db.collection("adminUsers").insertOne(adminUser);


    const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
    user: "api",
    pass: "75e0a49fbb20439b4331899c9de1390f"
    }
    });

    const verificationToken = crypto.randomBytes(20).toString('hex');


    await db.collection('adminUsers').updateOne(
      { email: adminUser.email },
      { $set: { verificationToken: verificationToken } }
    );

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/shelterAdmin/verify-email?email=${shelterData.email}&token=${verificationToken}`;

    const mailOptions = {
      from: 'info@demomailtrap.com', 
      to: shelterData.email, 
      subject: 'Shelter Registration - Email Verification',
      html: `
        <p>Thank you for registering your shelter with us!</p>
        <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
        <p>Please click the following link to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      shelterId: result.insertedId,
      message: "Shelter registration submitted successfully",
      timestamp: new Date().toISOString(),
      processingTime: (performance.now() - startTime).toFixed(2) + "ms",
      metadata: {
        collectionName: "shelters",
        databaseName: "shelterDB",
        documentCount: await db.collection("shelters").countDocuments(),
      },
    });
  } catch (error) {
    console.error("[Shelter Registration Error]:", {
      message: error.message,
      timestamp: new Date().toISOString(),
      processingTime: (performance.now() - startTime).toFixed(2) + "ms",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Failed to register shelter",
        error: error.message,
        timestamp: new Date().toISOString(),
        processingTime: (performance.now() - startTime).toFixed(2) + "ms",
      },
      { status: 500 }
    );
  }
}