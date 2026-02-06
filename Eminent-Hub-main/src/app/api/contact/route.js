// /src/app/api/contact/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const contactMessagesCollectionName = 'contactMessages';

export const POST = async (req) => {
    try {
        const requestData = await req.json();
        const { name, email, message } = requestData;
        
        if (!name || !email || !message) {
            return NextResponse.json({ error: "Please provide all the required fields." }, { status: 400 });
        }
        
        const client = await clientPromise;
        const db = client.db();
        const contactMessages = db.collection(contactMessagesCollectionName);
        
        const now = new Date();
        const result = await contactMessages.insertOne({
            name,
            email,
            message,
            createdAt: now,
        });
        
        const newMessageId = result.insertedId;
        
        return NextResponse.json({ message: "Message sent successfully!", id: newMessageId }, { status: 201 });
        
    } catch (error) {
        console.error("Error saving contact message:", error);
        return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
    }
};