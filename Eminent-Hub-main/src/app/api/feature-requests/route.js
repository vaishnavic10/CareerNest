// /src/app/api/feature-requests/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from 'nodemailer';

const featureRequestsCollectionName = 'featureRequests';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 15000, // 15 seconds
    socketTimeout: 15000,     // 15 seconds
});

export const POST = async (req) => {
    try {
        const requestData = await req.json();
        const { title, description, category, priority, email } = requestData; // Get the email from the request
        
        const client = await clientPromise;
        const db = client.db();
        const featureRequests = db.collection(featureRequestsCollectionName);
        
        const now = new Date();
        const result = await featureRequests.insertOne({
            title,
            description,
            category,
            priority,
            submittedBy: email, // Save the entered email
            createdAt: now,
        });
        
        const newFeatureRequestId = result.insertedId;
        
        // Send SMTP message using nodemailer
        try {
            const mailOptions = {
                from: `Your Website Feature Requests <${process.env.SMTP_USER}>`,
                to: email, // Use the entered email
                subject: 'Your Feature Request has been Received!',
                html: `
                    <p>Thank you for submitting your feature request!</p>
                    <p><b>Title:</b> ${title}</p>
                    <p><b>Description:</b> ${description}</p>
                    <p>We appreciate your contribution and will review your suggestion.</p>
                `,
            };
            
            const info = await transporter.sendMail(mailOptions);
            console.log('SMTP Email sent:', info);
        } catch (error) {
            console.error('Error sending SMTP email:', error);
            // Optionally handle email sending failure
        }
        
        return NextResponse.json({ message: "Feature request submitted successfully!", id: newFeatureRequestId }, { status: 201 });
        
    } catch (error) {
        console.error("Error submitting feature request:", error);
        return NextResponse.json({ error: "Failed to submit feature request" }, { status: 500 });
    }
};