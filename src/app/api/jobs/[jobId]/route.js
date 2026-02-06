import { getJobFromMongoDB, updateJobInMongoDB, switchJobStatus, deleteJobFromMongoDB } from "@/lib/jobTracking.js";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

// Retrieve a job application by jobId
export const GET = withAuth(async (req, context) => {
    try {
        const { jobId } = context.params;
        const job = await getJobFromMongoDB(jobId);
        return NextResponse.json(job);
    } catch (error) {
        console.error('Error retrieving job entry:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve job entry' },
            { status: 500 }
        );
    }
}, ['admin', 'user']);

// Update a job application (e.g., updating details)
export const PUT = withAuth(async (req, context) => {
    const { jobId } = context.params;
    try {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : {};
        const { email, ...updatedJob } = body;
        const result = await updateJobInMongoDB(jobId, updatedJob);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error updating job entry with ID ${jobId}:`, error);
        return NextResponse.json({ error: `Failed to update job entry with ID ${jobId}` }, { status: 500 });
    }
}, ['admin', 'user']);

// Optionally, switch job status via a PATCH endpoint
export const PATCH = withAuth(async (req, context) => {
    const { jobId } = context.params;
    try {
        const body = await req.json();
        const { newStatus } = body;
        const result = await switchJobStatus(jobId, newStatus);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error switching status for job entry with ID ${jobId}:`, error);
        return NextResponse.json({ error: `Failed to switch status for job entry with ID ${jobId}` }, { status: 500 });
    }
}, ['admin', 'user']);

// Delete a job application by jobId
export const DELETE = withAuth(async (req, context) => {
    const { jobId } = context.params;
    try {
        const result = await deleteJobFromMongoDB(jobId);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting job entry with ID ${jobId}:`, error);
        return NextResponse.json({ error: `Failed to delete job entry with ID ${jobId}` }, { status: 500 });
    }
}, ['admin', 'user']);

