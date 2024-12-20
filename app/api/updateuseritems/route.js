// app/api/updateuseritems/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import UserItem from '@/models/useritem';

export async function POST(request) {
    try {
        // Connect to database
        await connectMongoDB();

        const body = await request.json();
        const { userId, items ,isSubmitted} = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Filter out items with quantity 0 as per frontend logic
        const validItems = items.filter(item => item.quantity > 0);

        // Find the existing user items document
        let userItems = await UserItem.findOne({ userId });

        if (!userItems) {
            // If no document exists, create a new one
            userItems = new UserItem({
                userId,
                items: validItems,
                isSubmitted: isSubmitted || false,
                submittedOn: isSubmitted ? new Date() : null,
            });
        } else {
            // If document exists, replace all items
            // This matches the frontend behavior where the entire state is sent
            userItems.items = validItems;
            if (typeof isSubmitted === 'boolean') {
                userItems.isSubmitted = isSubmitted;
                userItems.submittedOn = isSubmitted ? new Date() : null;
            }
        }

        // Save the changes
        await userItems.save();

        return NextResponse.json({
            message: 'User items updated successfully',
            data: userItems
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating user items:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}