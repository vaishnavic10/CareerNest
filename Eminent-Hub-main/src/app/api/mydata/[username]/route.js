import { NextResponse } from "next/server";
import { publicUserProfile } from "@/lib/public.js";

export const GET = async (req, { params }) => {
    try {
        const resolvedParams = await params;
        const { username } = resolvedParams;
        
        const profileData = await publicUserProfile(username);
        if (!profileData) return NextResponse.json({ error: 'Public profile not found' }, { status: 404 });
        return NextResponse.json(profileData);
    } catch (error) {
        console.error('Error getting mydata user profile:', error);
        return NextResponse.json({ error: 'Failed to get mydata user profile' }, { status: 500 });
    }
};
