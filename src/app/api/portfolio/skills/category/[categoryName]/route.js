// app/api/portfolio/skills/category/[categoryName]/route.js
import { deleteSkillCategory } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const DELETE = withAuth(async (req, { params }) => {
    try {
        const { categoryName } = params;
        const { email } = await req.json();
        const result = await deleteSkillCategory(email, categoryName);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting skill category "${categoryName}":`, error);
        return NextResponse.json({ error: `Failed to delete skill category "${categoryName}"` }, { status: 500 });
    }
}, ['admin', 'user']);