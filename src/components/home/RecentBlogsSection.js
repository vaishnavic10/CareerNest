"use client";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import useBlog from "@/hooks/useBlog";

export default function RecentBlogsSection() {
    const { blogPosts, getAllBlogPosts } = useBlog();
    const [recentBlogs, setRecentBlogs] = useState([]);
    
    useEffect(() => {
        getAllBlogPosts(); // Fetch all blog posts on component mount
    }, [getAllBlogPosts]);
    
    useEffect(() => {
        if (blogPosts) {
            const sortedBlogs = [...blogPosts].sort(
                (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
            );
            setRecentBlogs(sortedBlogs.slice(0, 3)); // Get the top 3 most recent blogs
        }
    }, [blogPosts]);
    
    return (
        <section className="py-16">
            <div className="container mx-auto px-4 text-center">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-4 sm:mb-0">
                        Read the Latest from Our Bloggers
                    </h2>
                    {blogPosts && blogPosts.length > 3 && (
                        <Link href="/all-blogs">
                            <Button variant="gray" className="mt-4 sm:mt-0 sm:ml-4">
                                See All Blog Posts
                            </Button>
                        </Link>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentBlogs.map((blog) => (
                        <Link key={blog._id} href={`/${blog.authorUsername || 'user'}/blog/${blog.slug}`}>
                            <div className="bg-senary rounded-lg shadow-md overflow-hidden transform transition hover:scale-105">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={blog.bannerImage}
                                        alt={blog.title}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "";
                                        }}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                                        {blog.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {recentBlogs.length === 0 && (
                        <p className="text-foreground text-center">
                            No recent blog posts yet.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
