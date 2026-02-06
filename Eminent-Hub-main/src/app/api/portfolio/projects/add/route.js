// app/api/portfolio/projects/add/route.js
import { addProjectToPortfolio } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req) => {
    try {
        const { email, ...newProject } = await req.json();
        const result = await addProjectToPortfolio(email, newProject);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error adding project:', error);
        return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
    }
}, ['admin', 'user']);