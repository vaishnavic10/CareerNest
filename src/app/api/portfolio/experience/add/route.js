// app/api/portfolio/experience/add/route.js
import { addExperienceEntry } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req) => {
    try {
        const { email, ...newExperience } = await req.json();
        const result = await addExperienceEntry(email, newExperience);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error adding experience entry:', error);
        return NextResponse.json({ error: 'Failed to add experience entry' }, { status: 500 });
    }
}, ['admin', 'user']);