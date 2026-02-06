import { withAuth } from "@/middleware/withAuth";
import {
    getAllWebsiteUpdates,
    addWebsiteUpdate,
} from "@/lib/website-updates"; // Assuming you create this file
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        const updates = await getAllWebsiteUpdates();
        return NextResponse.json(updates);
    } catch (error) {
        console.error("Error fetching website updates:", error);
        return NextResponse.json({ error: "Failed to fetch website updates" }, { status: 500 });
    }
}

export const POST = withAuth(async (req) => {
    try {
        const updateData = await req.json();
        const newUpdate = await addWebsiteUpdate(updateData);
        return NextResponse.json(newUpdate, { status: 201 });
    } catch (error) {
        console.error("Error adding website update:", error);
        return NextResponse.json({ error: "Failed to add website update" }, { status: 500 });
    }
}, ['admin']);