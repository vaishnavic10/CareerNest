// app/api/search-users/route.js (assuming you are using the app router)
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Adjust the path if necessary

export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');
        
        if (!query || query.trim() === '') {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }
        
        const client = await clientPromise;
        const db = client.db();
        
        // Search for users
        const users = await db.collection('users').find({
            $or: [
                { displayName: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        }).limit(10).toArray();
        
        // Search for blog posts and include author information
        const blogPosts = await db.collection('blogposts').aggregate([
            {
                $match: { title: { $regex: query, $options: 'i' } }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorEmail',
                    foreignField: 'email',
                    as: 'authorInfo'
                }
            },
            {
                $unwind: '$authorInfo' // Assuming each post has one author
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    slug: 1,
                    bannerImage: 1,
                    author: {
                        displayName: '$authorInfo.displayName',
                        username: '$authorInfo.username'
                    }
                    // Add other relevant blog post fields you want to return
                }
            }
        ]).toArray();
        
        return NextResponse.json({ users, blogPosts });
        
    } catch (error) {
        console.error("Error searching:", error);
        return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
    }
};