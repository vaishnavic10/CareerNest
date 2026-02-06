import { updateProjectInPortfolio, deleteProjectFromPortfolio } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const PUT = withAuth(async (req, context) => {
    const params = await context.params;
    const projectId = new ObjectId(params.projectId);
    try {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : {};
        const { email, ...updatedProject } = body;
        const result = await updateProjectInPortfolio(email, projectId, updatedProject);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error updating project with ID ${projectId}:`, error);
        return NextResponse.json({ error: `Failed to update project with ID ${projectId}` }, { status: 500 });
    }
}, ['admin', 'user']);

export const DELETE = withAuth(async (req, context) => {
    const params = await context.params;
    const projectId = new ObjectId(params.projectId);
    try {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : {};
        const { email } = body;
        const result = await deleteProjectFromPortfolio(email, projectId);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting project with ID ${projectId}:`, error);
        return NextResponse.json({ error: `Failed to delete project with ID ${projectId}` }, { status: 500 });
    }
}, ['admin', 'user']);
