import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import jwt from 'jsonwebtoken';
import Students from '@/models/students';

// GET method for fetching student details
export async function GET(req) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Remove 'Bearer ' if present
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    // Verify the JWT token
    const secretKey = process.env.JWT_SECRET;
    
    if (!secretKey) {
      return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (verifyError) {
      if (verifyError.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      if (verifyError.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      throw verifyError;
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Fetch the student from the database with detailed information
    const student = await Students.findById(decoded.id).select('-password');

    // If student is not found, return a 404 error
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Prepare comprehensive student details
    const studentDetails = {
      id: student._id,
      name: student.name,
      fathername: student.fathername,
      bennettemail: student.bennettemail,
      course: student.course,
      batch: student.batch,
      profileCompletion: calculateProfileCompletion(student),
      contactInformation: {
        email: student.bennettemail,
        alternateEmail: student.alternateEmail || null,
        phoneNumber: student.phoneNumber || null
      },
      academicDetails: {
        course: student.course,
        batch: student.batch,
        semester: student.semester || null,
        specialization: student.specialization || null
      },
      accountStatus: {
        isVerified: student.isVerified || false,
        registrationDate: student._id.getTimestamp()
      }
    };

    // Return the detailed student data
    return NextResponse.json({
      message: 'Student details retrieved successfully',
      student: studentDetails
    }, { status: 200 });

  } catch (error) {
    console.error('Error during JWT verification or database query:', error);

    // Generic server error
    return NextResponse.json({ 
      error: 'Server Error', 
      details: error.message 
    }, { status: 500 });
  }
}

// Utility function to calculate profile completion
function calculateProfileCompletion(student) {
  const requiredFields = [
    'name', 'fathername', 'bennettemail', 
    'course', 'batch'
  ];

  const completedFields = requiredFields.filter(field => 
    student[field] && student[field].trim() !== ''
  );

  return {
    completedFields: completedFields,
    totalFields: requiredFields.length,
    completionPercentage: Math.round((completedFields.length / requiredFields.length) * 100)
  };
}