import connectMongoDB from "@/libs/mongodb";
import Students from "@/models/students";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import validator from "validator";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Input validation schema
const StudentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  fathername: z.string().trim().min(2, "Father's name must be at least 2 characters long")
    .max(50, "Father's name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Father's name can only contain letters, spaces, hyphens, and apostrophes"),
  
  course: z.string().trim().min(2, "Course name must be at least 2 characters long")
    .max(50, "Course name cannot exceed 50 characters"),
  
  batch: z.string().trim().regex(/^\d{4}$/, "Batch must be a 4-digit year"),
  
  bennettemail: z.string().trim().email("Invalid email format")
    .refine(val => val.toLowerCase().endsWith("@bennett.edu.in"), "Only Bennett University email addresses are allowed"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character")
});

// Function to generate JWT token
function generateToken(student) {
  // Ensure JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  // Create token payload
  const payload = {
    id: student._id,
    email: student.bennettemail,
    name: student.name
  };

  // Generate token with 7-day expiration
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: '7d' 
  });
}

export async function POST(request) {
  try {
    // Ensure MongoDB connection
    await connectMongoDB();

    // Parse and validate incoming request body
    const body = await request.json();

    // Validate input using Zod schema
    const validatedData = StudentSchema.parse(body);

    // Additional email validation (though Zod already handles this)
    if (!validator.isEmail(validatedData.bennettemail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await Students.findOne({
      bennettemail: validatedData.bennettemail
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: "Student with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password securely
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Create new student with hashed password
    const newStudents = await Students.create({
      ...validatedData,
      password: hashedPassword
    });

    // Generate JWT token
    const token = generateToken(newStudents);

    // Remove sensitive information before sending response
    const { password, ...studentResponse } = newStudents.toObject();

    // Log registration attempt (consider using a proper logging system in production)
    console.log(`New student registered: ${validatedData.bennettemail}`);

    return NextResponse.json(
      {
        message: "Student Created Successfully",
        student: studentResponse,
        token: token // Include the token in the response
      },
      { status: 201 }
    );

  } catch (error) {
    // Handle different types of errors
    if (error instanceof z.ZodError) {
      // Validation errors
      return NextResponse.json(
        {
          message: "Validation Error",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Log the full error for server-side debugging
    console.error("Registration error:", error);

    // Generic error response
    return NextResponse.json(
      {
        message: "Error creating student account",
        error: "Internal server error"
      },
      { status: 500 }
    );
  }
}