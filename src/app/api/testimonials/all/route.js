// pages/api/admin/testimonials/all.js
import { withAuth } from "@/middleware/withAuth";
import { getAllTestimonials } from "@/lib/testimonials";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        const testimonials = await getAllTestimonials();
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching all testimonials:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
};