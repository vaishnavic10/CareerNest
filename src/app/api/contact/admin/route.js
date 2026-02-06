// /src/app/api/contact/admin/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId
import { withAuth } from "@/middleware/withAuth.js";

const contactMessagesCollectionName = 'contactMessages';

const getAdminContactMessages = async (req) => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const contactMessages = db.collection(contactMessagesCollectionName);
        
        const allMessages = await contactMessages.find({}).sort({ createdAt: -1 }).toArray();
        
        return NextResponse.json({ allMessages }, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
    }
};

const deleteContactMessage = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: "Missing 'id' parameter." }, { status: 400 });
        }
        
        const client = await clientPromise;
        const db = client.db();
        const contactMessages = db.collection(contactMessagesCollectionName);
        
        const result = await contactMessages.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 1) {
            return NextResponse.json({ message: `Contact message with ID ${id} deleted successfully.` }, { status: 200 });
        } else if (result.deletedCount === 0) {
            return NextResponse.json({ error: `Contact message with ID ${id} not found.` }, { status: 404 });
        } else {
            return NextResponse.json({ error: `Error deleting contact message with ID ${id}.` }, { status: 500 });
        }
        
    } catch (error) {
        console.error("Error deleting contact message:", error);
        return NextResponse.json({ error: "Failed to delete contact message." }, { status: 500 });
    }
};

export const GET = withAuth(getAdminContactMessages, ['admin']);
export const DELETE = withAuth(deleteContactMessage, ['admin']);