import {withAuth} from "@/middleware/withAuth.js";
import {getAllUsersFromMongoDB} from "@/lib/users.js";
import {NextResponse} from "next/server";

export const GET = withAuth(async () => {
    try {
        const users = await getAllUsersFromMongoDB();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        return NextResponse.json({ error: 'Failed to get all users' }, { status: 500 });
    }
}, ['admin']);