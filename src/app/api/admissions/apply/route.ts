
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const admissionSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().or(z.date()), // Accept string or date
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(5, "Address is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  
  previousSchool: z.string().min(2, "Previous school is required"),
  previousGrade: z.string().min(1, "Previous grade/result is required"),
  transcriptUrl: z.string().optional(), // Base64 string or URL
  
  program: z.string().min(2, "Program selection is required"),
  
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelation: z.string().min(2, "Relation is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Convert date string to Date object if needed before validation/prisma
    if (typeof body.dateOfBirth === 'string') {
        body.dateOfBirth = new Date(body.dateOfBirth);
    }

    const result = admissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        message: "Invalid form data", 
        errors: result.error.errors 
      }, { status: 400 });
    }

    const data = result.data;

    // Generate a unique tracking ID (e.g., ADM-TIMESTAMP-RANDOM)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    const trackingId = `ADM-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const admission = await prisma.admission.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth), // Ensure Date type
        trackingId,
        status: "PENDING",
      },
    });

    // Mock Email Sending (In production, use Resend/SendGrid)
    console.log(`[EMAIL] To: ${admission.email} | Subject: Application Received`);
    console.log(`[EMAIL] Body: Dear ${admission.firstName}, your application to Titan University has been received. Your Tracking ID is: ${trackingId}.`);

    return NextResponse.json({ 
      success: true, 
      message: "Application submitted successfully", 
      trackingId: admission.trackingId 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Admission submission error:", error);
    return NextResponse.json({ 
      message: "Internal server error", 
      error: error.message 
    }, { status: 500 });
  }
}
