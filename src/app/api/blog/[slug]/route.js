// app/api/blog/[slug]/route.js
import { getBlogPostBySlug, updateBlogPost, deleteBlogPost } from "@/lib/blog";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    try {
        const { slug } = params;
        const post = await getBlogPostBySlug(slug);
        if (!post) {
            return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
        }
        return NextResponse.json(post);
    } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        return NextResponse.json({ error: `Failed to fetch blog post with slug ${slug}` }, { status: 500 });
    }
};

export const PUT = withAuth(async (req, { params }) => {
    try {
        const { slug } = params;
        const { email, _id, ...updatedPost } = await req.json();
        const result = await updateBlogPost(email, _id, updatedPost);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error updating blog post with slug ${slug}:`, error);
        return NextResponse.json({ error: `Failed to update blog post with slug ${slug}` }, { status: 500 });
    }
}, ['admin', 'user']);

export const DELETE = withAuth(async (req, { params }) => {
    try {
        const { slug } = params;
        const { email, id } = await req.json();
        // Assuming the frontend sends 'id' for deletion
        const result = await deleteBlogPost(email, id);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Error deleting blog post with slug ${slug}:`, error);
        return NextResponse.json({ error: `Failed to delete blog post with slug ${slug}` }, { status: 500 });
    }
}, ['admin', 'user']);