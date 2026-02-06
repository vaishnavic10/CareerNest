import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import {getAllJobsFromMongoDB} from '@/lib/jobTracking.js'; // your DB function

export const GET = withAuth(async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        
        if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        const jobs = await getAllJobsFromMongoDB(email);
        
        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Error retrieving jobs:', error);
        return NextResponse.json({ error: 'Failed to retrieve jobs' }, { status: 500 });
    }
}, ['admin', 'user']);
