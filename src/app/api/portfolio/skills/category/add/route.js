// app/api/portfolio/skills/category/add/route.js
import { addSkillCategoryToPortfolio } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req) => {
    try {
        const { email, ...newCategory } = await req.json();
        const result = await addSkillCategoryToPortfolio(email, newCategory);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error adding skill category:', error);
        return NextResponse.json({ error: 'Failed to add skill category' }, { status: 500 });
    }
}, ['admin', 'user']);