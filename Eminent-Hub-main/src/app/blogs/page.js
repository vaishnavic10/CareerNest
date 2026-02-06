"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer.js";
import useBlog from "@/hooks/useBlog";
import useTabTitle from "@/hooks/useTabTitle.js"; // Import the hook

export default function AllBlogsPage() {
    useTabTitle("All Blogs"); // Set the tab title
    const { loading, error, blogPosts, getAllBlogPosts } = useBlog(); // Use the hook
    
    useEffect(() => {
        getAllBlogPosts(); // Fetch all blog posts on component mount
    }, [getAllBlogPosts]);
    
    if (loading) {
        return <div className="container mx-auto p-6 text-center">Loading all blogs...</div>;
    }
    
    if (error) {
        return <div className="container mx-auto p-6 text-center">Error loading all blogs: {error}</div>;
    }
    
    
    return (
        <>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-foreground text-center">All Blogs</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts && blogPosts.map((post) => (
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
                                <Link href={`/${post.authorUsername || 'user'}/blog/${post.slug}`} className="text-xl font-semibold hover:underline text-foreground">
                                    {post.title}
                                </Link>
                                <p className="text-foreground text-sm mt-2">{new Date(post.date).toLocaleDateString()}</p>
                                <p className="text-foreground mt-2" dangerouslySetInnerHTML={{ __html: post.content ? post.content.substring(0, 100) + "..." : "" }}>
                                    {/* Consider using an excerpt field in your backend */}
                                </p>
                            </div>
                        </div>
                    ))}
                    {blogPosts && blogPosts.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">
                            No blogs found.
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}