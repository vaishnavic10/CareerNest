"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import useBlog from '@/hooks/useBlog';
import useUserOperations from '@/hooks/useUserOperations';
import { useAuth } from "@/context/authContext.js";
import {FaEye} from "react-icons/fa";
import useTabTitle from "@/hooks/useTabTitle.js"; // Assuming the hook is in this path

const BlogIndexPage = () => {
    useTabTitle("My Blog");
    const { user } = useAuth();
    const router = useRouter();
    const { username } = useUserOperations();
    const { loading, error, blogPosts, getBlogPostsByAuthor } = useBlog();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);

    const fetchBlogPosts = useCallback(async () => {
        const data = await getBlogPostsByAuthor();
        setFilteredPosts(data);
    }, [getBlogPostsByAuthor]);

    useEffect(() => {
        fetchBlogPosts();
    }, [fetchBlogPosts]);
    const filterByDateOption = useCallback((postDateStr) => {
        const postDate = new Date(postDateStr);
        const today = new Date();

        switch (filterOption) {
            case 'today':
                return isSameDate(postDate, today);
            case 'yesterday':
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                return isSameDate(postDate, yesterday);
            case '1week':
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                return postDate >= oneWeekAgo && postDate <= today;
            case 'custom':
                if (customFrom && customTo) {
                    const fromDate = new Date(customFrom);
                    const toDate = new Date(customTo);
                    return postDate >= fromDate && postDate <= toDate;
                }
                return true;
            default:
                return true;
        }
    }, [filterOption, customFrom, customTo]);
    
    const filterPosts = useCallback((posts, query, filter, fromDate, toDate) => {
        return posts.filter((post) => {
            const matchesSearch =
                post.title?.toLowerCase().includes(query.toLowerCase()) ||
                post.content?.toLowerCase().includes(query.toLowerCase());
            const matchesDate = filterByDateOption(post.date);
            return matchesSearch && matchesDate;
        });
    }, [filterByDateOption]);

    useEffect(() => {
        if (blogPosts) {
            setFilteredPosts(filterPosts(blogPosts, searchQuery, filterOption, customFrom, customTo));
        }
    }, [blogPosts, searchQuery, filterOption, customFrom, customTo, filterPosts]);

    const handleEditPost = (slug) => {
        router.push(`/my-account/blog/edit/${slug}`);
    };

    const handleAddNewPost = () => {
        router.push('/my-account/blog/edit/new');
    };

    const isSameDate = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    if (loading) {
        return <p>Loading blog posts...</p>;
    }

    if (error) {
        return <p>Error loading blog posts: {error}</p>;
    }

    return (
        <div className="container min-h-screen mx-auto mb-16 p-2">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Blog</h1>
                <Button onClick={handleAddNewPost} variant="secondary">
                    Add New Post
                </Button>
            </div>

            {/* Filter Section */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border border-border rounded-lg w-full sm:w-1/2"
                />

                <select
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                    className="p-2 border border-border rounded-lg w-full sm:w-1/4 text-foreground bg-background"
                >
                    <option value="">All Dates</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="1week">Last 1 Week</option>
                    <option value="custom">Custom</option>
                </select>

                {filterOption === 'custom' && (
                    <div className="flex gap-2 w-full sm:w-1/4">
                        <input
                            type="date"
                            value={customFrom}
                            onChange={(e) => setCustomFrom(e.target.value)}
                            className="p-2 border border-border rounded-lg w-1/2"
                        />
                        <input
                            type="date"
                            value={customTo}
                            onChange={(e) => setCustomTo(e.target.value)}
                            className="p-2 border border-border rounded-lg w-1/2"
                        />
                    </div>
                )}
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div
                            key={post._id}
                            onClick={() => handleEditPost(post.slug)}
                            className="cursor-pointer bg-background border border-border rounded-lg  hover:bg-senary transition-all p-4"
                        >
                            <h3 className="text-lg font-semibold truncate mb-2 flex items-center gap-2">
                                
                                <span>{post.title}</span>
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-400 mt-1">{new Date(post.date).toLocaleDateString()}</p>
                                <a
                                    href={`/${username}/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaEye size={22} className="text-foreground opacity-35"/>
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No posts match your criteria.
                    </p>
                )}
            </div>
        </div>
    );
};

export default BlogIndexPage;
