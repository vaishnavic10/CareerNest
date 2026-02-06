import { withAuth } from "@/middleware/withAuth";
import { addTestimonialByAdmin } from "@/lib/testimonials";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req) => {
    try {
        const { testimonialData } = await req.json(); // Expecting an object with testimonial details and userEmail
        const result = await addTestimonialByAdmin(testimonialData);
        return NextResponse.json({ message: 'Testimonial added successfully by admin', result }, { status: 201 });
    } catch (error) {
        console.error('Error adding testimonial by admin:', error);
        return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 });
    }
}, ['admin']); // Only users with the 'admin' role can access this route