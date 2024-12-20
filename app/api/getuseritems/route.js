import connectMongoDB from "@/libs/mongodb";
import UserItem from "@/models/useritem";
import { NextResponse } from "next/server";

// GET method to retrieve user items
export async function GET(request) {
  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Ensure MongoDB is connected
    await connectMongoDB();

    // Find the user items
    const userItems = await UserItem.findOne({ userId });

    // Check if user items exist
    if (!userItems) {
      return NextResponse.json(
        { message: "No items found for this user" },
        { status: 404 }
      );
    }

    // Return the user items
    return NextResponse.json(
      { 
        message: "User items retrieved successfully", 
        data: userItems.items ,
        isSubmitted:userItems.isSubmitted,
        submittedOn: userItems.submittedOn,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error retrieving user items:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}