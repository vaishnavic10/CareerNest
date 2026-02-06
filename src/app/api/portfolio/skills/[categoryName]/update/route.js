// app/api/portfolio/skills/[categoryName]/update/route.js
import { updateSkillCategory } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const PUT = withAuth(async (req, { params }) => {
    try {
        const { categoryName } = params;
        const { email, ...updatedCategory } = await req.json();
        const result = await updateSkillCategory(email, categoryName, updatedCategory);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error updating skill category "${categoryName}":`, error);
        return NextResponse.json({ error: `Failed to update skill category "${categoryName}"` }, { status: 500 });
    }
}, ['admin', 'user']);