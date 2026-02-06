import { updateExperienceEntry, deleteExperienceEntry } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const PUT = withAuth(async (req, context) => {
    const params = await context.params;
    const experienceId = new ObjectId(params.experienceId); // Convert to ObjectId
    try {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : {};
        const { email, ...updatedExperience } = body;
        const result = await updateExperienceEntry(email, experienceId, updatedExperience);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error updating experience entry with ID ${experienceId}:`, error);
        return NextResponse.json(
            { error: `Failed to update experience entry with ID ${experienceId}` },
            { status: 500 }
        );
    }
}, ['admin', 'user']);

export const DELETE = withAuth(async (req, context) => {
    const params = await context.params;
    const experienceId = new ObjectId(params.experienceId); // Convert to ObjectId
    try {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : {};
        const { email } = body;
        const result = await deleteExperienceEntry(email, experienceId);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting experience entry with ID ${experienceId}:`, error);
        return NextResponse.json(
            { error: `Failed to delete experience entry with ID ${experienceId}` },
            { status: 500 }
        );
    }
}, ['admin', 'user']);
