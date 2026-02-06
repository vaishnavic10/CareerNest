// app/api/blog/route.js
import { getAllBlogPosts, addBlogPost } from "@/lib/blog";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const posts = await getAllBlogPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching all blog posts:", error);
        return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
    }
};

export const POST = withAuth(async (req) => {
    try {
        const { email, ...newPost } = await req.json();
        const result = await addBlogPost(email, newPost);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error adding new blog post:", error);
        return NextResponse.json({ error: "Failed to add blog post" }, { status: 500 });
    }
}, ['admin', 'user']);