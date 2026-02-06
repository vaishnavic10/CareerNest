// app/api/portfolio/personal/[email]/route.js
import { updatePersonalInformation } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const PUT = withAuth(async (req, { params }) => {
    try {
        const { email } = params;
        const updateData = await req.json();
        const result = await updatePersonalInformation(email, updateData);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating personal information:', error);
        return NextResponse.json({ error: 'Failed to update personal information' }, { status: 500 });
    }
}, ['admin', 'user']);