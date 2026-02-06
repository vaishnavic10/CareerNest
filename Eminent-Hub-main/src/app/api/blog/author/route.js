// app/api/blog/author/route.js
import { getBlogPostsByAuthor } from "@/lib/blog";
import { withAuth } from "@/middleware/withAuth";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        
        const posts = await getBlogPostsByAuthor(email);
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts by author:", error);
        return NextResponse.json({ error: "Failed to fetch blog posts by author" }, { status: 500 });
    }
}, ['user']);
