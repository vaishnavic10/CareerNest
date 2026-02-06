"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer.js";
import { useParams } from "next/navigation";
import useUserProfile from "@/hooks/useUserProfile";
import useTabTitle from "@/hooks/useTabTitle.js"; // Import useUserProfile hook

export default function BlogIndexPage() {
    useTabTitle("User Blogs"); // Set the tab title
    const { username } = useParams();
    const { userData, loading, error } = useUserProfile(username); // Use useUserProfile hook
    
    useEffect(() => {
        // No need to call getAllBlogPosts here as we are using useUserProfile
    }, [username, userData]); // Re-run effect if username or userData changes
    
    if (loading) {
        return <div className="container mx-auto p-6 text-center">Loading blogs...</div>;
    }
    
    if (error) {
        return <div className="container mx-auto p-6 text-center">Error loading blogs: {error}</div>;
    }
    
    
    return (
        <>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-foreground">Blogs Written By {userData?.displayName}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {userData?.blogs && userData.blogs.map((post) => ( // Use userData.blogs
                        <div key={post._id} className="bg-senary rounded-lg shadow border border-border">
                            {post.bannerImage ? (
                                <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={post.bannerImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover bg-background"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-4 rounded">
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}
                            <div className="p-4">
                                <Link href={`/${username}/blog/${post.slug}`} className="text-xl font-semibold hover:underline text-foreground">
                                    {post.title}
                                </Link>
                                
                                <p className="text-foreground text-sm mt-2">{new Date(post.date).toLocaleDateString()}</p>
                                <p className="text-foreground mt-2" dangerouslySetInnerHTML={{ __html: post.content ? post.content.substring(0, 100) + "..." : "" }}>
                                    {/* You might want to store an excerpt in the backend for better performance */}
                                </p>
                            </div>
                        </div>
                    ))}
                    {userData?.blogs && userData.blogs.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">
                            No blogs found for this user.
                        </div>
                    )}
                    {!userData?.blogs && !loading && !error && (
                        <div className="col-span-full text-center text-gray-500">
                            Could not load user&apos;s blogs.
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}