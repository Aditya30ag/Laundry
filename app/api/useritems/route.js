import connectMongoDB from "@/libs/mongodb";
import UserItem from "@/models/useritem";

import { NextResponse } from "next/server";

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


// POST method to create user items
export async function POST(request) {
  try {
    await connectMongoDB(); // Ensure MongoDB is connected

    // Get the request body
    const { userId} = await request.json();

    // Check if the user already has an entry in the database
    const existingUserItems = await UserItem.findOne({ userId });
    if (existingUserItems) {
      return NextResponse.json(
        { message: "Items already exist for this user." },
        { status: 400 }
      );
    }

    // Create a new UserItem document
    const userItems = new UserItem({
      userId,
      items: defaultItems,
    });

    // Save the new user items
    await userItems.save();

    return NextResponse.json(
      { message: "User items created successfully", data: userItems },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user items:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}