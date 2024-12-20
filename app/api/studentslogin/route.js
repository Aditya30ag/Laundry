import connectMongoDB from "@/libs/mongodb";
import Students from "@/models/students";
import UserItem from "@/models/useritem";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from 'jsonwebtoken';

// Default items to be created for each user
const defaultItems = [
    { id: 1, name: "T-Shirt", quantity: 0, category: "Tops" },
    { id: 2, name: "Jeans", quantity: 0, category: "Bottoms" },
    { id: 3, name: "Dress Shirts", quantity: 0, category: "Tops" },
    { id: 4, name: "Shorts", quantity: 0, category: "Bottoms" },
    { id: 5, name: "Socks", quantity: 0, category: "Accessories" },
    { id: 6, name: "Kurta", quantity: 0, category: "Traditional Wear" },
    { id: 7, name: "Pajama", quantity: 0, category: "Traditional Wear" },
    { id: 8, name: "Bedsheet", quantity: 0, category: "Home Textiles" },
    { id: 9, name: "Pillow Cover", quantity: 0, category: "Home Textiles" },
    { id: 10, name: "Towel", quantity: 0, category: "Bathroom" },
    { id: 11, name: "Dupatta", quantity: 0, category: "Accessories" },
];

// Login input validation schema
const LoginSchema = z.object({
    bennettemail: z.string().trim()
        .email("Invalid email format")
        .refine(val => val.toLowerCase().endsWith("@bennett.edu.in"), "Only Bennett University email addresses are allowed"),
    
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
});

// Function to create default user items
async function createDefaultUserItems(userId) {
    try {
        const existingUserItems = await UserItem.findOne({ userId });
        
        if (existingUserItems) {
            return existingUserItems;
        }

        const userItems = new UserItem({
            userId,
            items: defaultItems,
            isSubmitted: false, 
            submittedOn: null
        });

        await userItems.save();
        return userItems;
    } catch (error) {
        console.error("Error creating user items:", error);
        throw error;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const validatedData = LoginSchema.parse(body);

        await connectMongoDB();

        const student = await Students.findOne({
            bennettemail: validatedData.bennettemail
        });

        if (!student) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            validatedData.password,
            student.password
        );

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            {
                userId: student._id,
                email: student.bennettemail
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userItems = await createDefaultUserItems(student._id);
        const { password, ...studentDetails } = student.toObject();

        return NextResponse.json(
            {
                message: "Login Successful",
                token,
                student: studentDetails,
                userId: student._id,
                userItems: {
                    items: userItems.items,
                    isSubmitted: userItems.isSubmitted,
                    submittedOn: userItems.submittedOn
                },
            },
            {
                status: 200,
                headers: {
                    'Set-Cookie': `authToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict; Secure`
                }
            }
        );

    } catch (error) {
        if (error instanceof z.ZodError) {
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

        console.error("Login error:", error);
        return NextResponse.json(
            {
                message: "Login failed",
                error: "Internal server error"
            },
            { status: 500 }
        );
    }
}





