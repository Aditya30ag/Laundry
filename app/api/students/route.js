import connectMongoDB from "@/libs/mongodb";
import Students from "@/models/students";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import validator from "validator";
import { z } from "zod";

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
    
    // Remove sensitive information before sending response
    const { password, ...studentResponse } = newStudents.toObject();
    
    // Log registration attempt (consider using a proper logging system in production)
    console.log(`New student registered: ${validatedData.bennettemail}`);
    
    return NextResponse.json(
      {
        message: "Student Created Successfully",
        student: studentResponse
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


// const LoginSchema = z.object({
//     bennettemail: z.string().trim()
//       .email("Invalid email format")
//       .refine(val => val.toLowerCase().endsWith("@bennett.edu.in"), "Only Bennett University email addresses are allowed"),
    
//     password: z.string()
//       .min(8, "Password must be at least 8 characters long")
//   });
  
//   export async function POST(request) {
//     try {
//       // Parse incoming request body
//       const body = await request.json();
      
//       // Validate input using Zod schema
//       const validatedData = LoginSchema.parse(body);
  
//       // Connect to MongoDB
//       await connectMongoDB();
  
//       // Find student by email
//       const student = await Students.findOne({ 
//         bennettemail: validatedData.bennettemail 
//       });
  
//       // Check if student exists
//       if (!student) {
//         return NextResponse.json(
//           { message: "Invalid email or password" },
//           { status: 401 }
//         );
//       }
  
//       // Verify password
//       const isPasswordCorrect = await bcrypt.compare(
//         validatedData.password, 
//         student.password
//       );
  
//       // Handle incorrect password
//       if (!isPasswordCorrect) {
//         return NextResponse.json(
//           { message: "Invalid email or password" },
//           { status: 401 }
//         );
//       }
  
//       // Generate JWT token
//       const token = jwt.sign(
//         { 
//           userId: student._id,
//           email: student.bennettemail 
//         }, 
//         process.env.JWT_SECRET, 
//         { 
//           expiresIn: '24h' 
//         }
//       );
  
//       // Prepare response (exclude sensitive information)
//       const { password, ...studentDetails } = student.toObject();
  
//       // Log successful login attempt
//       console.log(`Successful login: ${validatedData.bennettemail}`);
  
//       // Return success response with token
//       return NextResponse.json(
//         { 
//           message: "Login Successful", 
//           token,
//           student: studentDetails 
//         },
//         { 
//           status: 200,
//           // Set secure HTTP-only cookie (recommended for web applications)
//           headers: {
//             'Set-Cookie': `authToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict; Secure`
//           }
//         }
//       );
  
//     } catch (error) {
//       // Handle Zod validation errors
//       if (error instanceof z.ZodError) {
//         return NextResponse.json(
//           { 
//             message: "Validation Error", 
//             errors: error.errors.map(err => ({
//               field: err.path.join('.'),
//               message: err.message
//             }))
//           },
//           { status: 400 }
//         );
//       }
  
//       // Log and handle other errors
//       console.error("Login error:", error);
  
//       return NextResponse.json(
//         { 
//           message: "Login failed", 
//           error: "Internal server error" 
//         },
//         { status: 500 }
//       );
//     }
//   }
  
//   Middleware for protecting routes (you can use this in other route handlers)
//   export async function authenticateStudent(req) {
//     // Extract token from cookies or Authorization header
//     const token = req.cookies.get('authToken')?.value || 
//                   req.headers.get('authorization')?.split(' ')[1];
  
//     if (!token) {
//       return NextResponse.json(
//         { message: "No authentication token provided" },
//         { status: 401 }
//       );
//     }
  
//     try {
//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//       // Optional: Check if user still exists
//       const student = await Students.findById(decoded.userId);
//       if (!student) {
//         return NextResponse.json(
//           { message: "Invalid authentication" },
//           { status: 401 }
//         );
//       }
  
//       // Attach user information to the request
//       return {
//         authenticated: true,
//         student: {
//           id: student._id,
//           email: student.bennettemail
//         }
//       };
  
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         return NextResponse.json(
//           { message: "Token expired. Please log in again." },
//           { status: 401 }
//         );
//       }
  
//       return NextResponse.json(
//         { message: "Authentication failed" },
//         { status: 401 }
//       );
//     }
//   }
