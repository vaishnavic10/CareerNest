// app/api/portfolio/skills/[categoryName]/add/route.js
import { addSkillToCategory } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req, { params }) => {
    try {
        const { categoryName } = params;
        const { email, newSkill } = await req.json();
        const result = await addSkillToCategory(email, categoryName, newSkill);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error adding skill to category "${categoryName}":`, error);
        return NextResponse.json({ error: `Failed to add skill to category "${categoryName}"` }, { status: 500 });
    }
}, ['admin', 'user']);