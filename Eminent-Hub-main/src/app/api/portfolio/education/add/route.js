// app/api/portfolio/education/add/route.js
import { addEducationEntry } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req) => {
    try {
        const { email, ...newEducation } = await req.json();
        const result = await addEducationEntry(email, newEducation);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error adding education entry:', error);
        return NextResponse.json({ error: 'Failed to add education entry' }, { status: 500 });
    }
}, ['admin', 'user']);