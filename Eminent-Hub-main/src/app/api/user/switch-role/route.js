import { switchUserRole } from "@/lib/users";
import { NextResponse } from "next/server";
import {withAuth} from "@/middleware/withAuth.js";

export const PUT = withAuth(async (req) => {
    try {
        const { email } = await req.json();
        
        if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
        const result = await switchUserRole(email);
        return NextResponse.json({
            message: "User role switched successfully",
            result,
        });
    } catch (error) {
        console.error("Error switching user role:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}, ['admin', 'user']);


