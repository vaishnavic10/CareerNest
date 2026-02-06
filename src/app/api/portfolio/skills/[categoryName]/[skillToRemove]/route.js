// app/api/portfolio/skills/[categoryName]/[skillToRemove]/route.js
import { deleteSkillFromCategory } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const DELETE = withAuth(async (req, { params }) => {
    try {
        const { categoryName, skillToRemove } = params;
        const { email } = await req.json();
        const result = await deleteSkillFromCategory(email, categoryName, skillToRemove);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting skill "${skillToRemove}" from category "${categoryName}":`, error);
        return NextResponse.json({ error: `Failed to delete skill "${skillToRemove}" from category "${categoryName}"` }, { status: 500 });
    }
}, ['admin', 'user']);