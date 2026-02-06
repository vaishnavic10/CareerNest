// /src/app/api/testimonials/[id]/route.js

import { withAuth } from "@/middleware/withAuth";
import { updateTestimonialByAdmin, deleteTestimonialByAdmin } from "@/lib/testimonials";
import { NextResponse } from "next/server";

export const PUT = withAuth(async (req, { params }) => {
    const { id } = await params; // Await the params object
    try {
        const updatedTestimonial = await req.json();
        const result = await updateTestimonialByAdmin(id, updatedTestimonial);
        return NextResponse.json({ message: 'Testimonial updated successfully by admin', result });
    } catch (error) {
        console.error('Error updating testimonial by admin:', error);
        return NextResponse.json({ error: 'Failed to update testimonial', details: error.message }, { status: 500 });
    }
}, ['admin']);

export const DELETE = withAuth(async (req, { params }) => {
    const { id } = await params; // Await the params object
    try {
        const result = await deleteTestimonialByAdmin(id);
        if (result.deleted) {
            return NextResponse.json({ message: result.message });
        } else {
            return NextResponse.json({ error: result.message }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting testimonial by admin:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial', details: error.message }, { status: 500 });
    }
}, ['admin']);