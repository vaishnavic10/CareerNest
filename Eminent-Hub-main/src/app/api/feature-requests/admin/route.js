// /src/app/api/feature-requests/admin/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId
import { withAuth } from "@/middleware/withAuth.js";

const featureRequestsCollectionName = 'featureRequests';

export const GET = withAuth(async (req) => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const featureRequests = db.collection(featureRequestsCollectionName);
        
        const requests = await featureRequests.find({}).toArray();
        
        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching feature requests:", error);
        return NextResponse.json({ error: "Failed to fetch feature requests" }, { status: 500 });
    }
}, ['admin']);

export const DELETE = withAuth(async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: "Missing 'id' parameter." }, { status: 400 });
        }
        
        const client = await clientPromise;
        const db = client.db();
        const featureRequests = db.collection(featureRequestsCollectionName);
        
        const result = await featureRequests.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 1) {
            return NextResponse.json({ message: `Feature request with ID ${id} deleted successfully.` }, { status: 200 });
        } else if (result.deletedCount === 0) {
            return NextResponse.json({ error: `Feature request with ID ${id} not found.` }, { status: 404 });
        } else {
            return NextResponse.json({ error: `Error deleting feature request with ID ${id}.` }, { status: 500 });
        }
        
    } catch (error) {
        console.error("Error deleting feature request:", error);
        return NextResponse.json({ error: "Failed to delete feature request." }, { status: 500 });
    }
}, ['admin']);