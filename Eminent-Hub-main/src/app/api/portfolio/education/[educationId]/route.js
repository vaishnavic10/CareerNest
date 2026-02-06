// app/api/portfolio/education/[educationId]/route.js
import { updateEducationEntry, deleteEducationEntry } from "@/lib/portfolio";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const PUT = withAuth(async (req, { params }) => {
    try {
        const { educationId } = params;
        const { email, ...updatedEducation } = await req.json();
        const result = await updateEducationEntry(email, educationId, updatedEducation);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error updating education entry with ID ${educationId}:`, error);
        return NextResponse.json({ error: `Failed to update education entry with ID ${educationId}` }, { status: 500 });
    }
}, ['admin', 'user']);

export const DELETE = withAuth(async (req, { params }) => {
    try {
        const { educationId } = params;
        const { email } = await req.json();
        const result = await deleteEducationEntry(email, educationId);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting education entry with ID ${educationId}:`, error);
        return NextResponse.json({ error: `Failed to delete education entry with ID ${educationId}` }, { status: 500 });
    }
}, ['admin', 'user']);