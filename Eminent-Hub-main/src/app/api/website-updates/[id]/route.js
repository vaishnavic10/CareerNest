// /src/app/api/website-updates/[id]/route.js

import { withAuth } from "@/middleware/withAuth";
import {
    getWebsiteUpdateById,
    updateWebsiteUpdate,
    deleteWebsiteUpdate,
} from "@/lib/website-updates";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req, { params }) => {
    const { id } = await params;
    try {
        const update = await getWebsiteUpdateById(id);
        if (!update) {
            return NextResponse.json({ error: "Website update not found" }, { status: 404 });
        }
        return NextResponse.json(update);
    } catch (error) {
        console.error(`Error fetching website update with ID ${id}:`, error);
        return NextResponse.json({ error: "Failed to fetch website update" }, { status: 500 });
    }
}, ['admin']);

export const PUT = withAuth(async (req, { params }) => {
    const { id } = await params; // Await params here
    try {
        const updateData = await req.json();
        const updatedUpdate = await updateWebsiteUpdate(id, updateData);
        if (!updatedUpdate) {
            return NextResponse.json({ error: "Website update not found" }, { status: 404 });
        }
        return NextResponse.json(updatedUpdate);
    } catch (error) {
        console.error(`Error updating website update with ID ${id}:`, error);
        return NextResponse.json({ error: "Failed to update website update" }, { status: 500 });
    }
}, ['admin']);

export const DELETE = withAuth(async (req, { params }) => {
    const { id } = await params; // Await params here
    try {
        const deleted = await deleteWebsiteUpdate(id);
        if (deleted) {
            return NextResponse.json({ message: "Website update deleted successfully" });
        } else {
            return NextResponse.json({ error: "Website update not found" }, { status: 404 });
        }
    } catch (error) {
        console.error(`Error deleting website update with ID ${id}:`, error);
        return NextResponse.json({ error: "Failed to delete website update" }, { status: 500 });
    }
}, ['admin']);