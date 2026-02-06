import { saveJobToMongoDB } from "@/lib/jobTracking.js";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req) => {
    try {
        const { email, ...newJob } = await req.json();
        const result = await saveJobToMongoDB({ email, ...newJob });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error adding job entry:', error);
        return NextResponse.json({ error: 'Failed to add job entry' }, { status: 500 });
    }
}, ['admin', 'user']);
