import { getUserFromMongoDB, updateUserInMongoDB } from "@/lib/users.js";
import { withAuth } from "@/middleware/withAuth.js";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
    try {
        const email = req.nextUrl.searchParams.get('email');
        const user = await getUserFromMongoDB(email);
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
    }
}, ['admin', 'user']);

export const PUT = withAuth(async (req) => {
    try {
        const { email, update } = await req.json();
        const result = await updateUserInMongoDB(email, update);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}, ['admin', 'user']);
