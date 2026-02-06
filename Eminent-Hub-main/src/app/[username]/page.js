"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiHomeLine, RiMore2Line, RiShareLine } from "react-icons/ri";
import { HiDotsHorizontal } from "react-icons/hi";
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useUserProfile from "@/hooks/useUserProfile";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function UserProfilePage() {
    // Set the page title
    useTabTitle("User Profile");
    const { username } = useParams();
    const { userData, loading, error } = useUserProfile(username);

    const [activeTab, setActiveTab] = useState("activity");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getUserInitials = () => {
        if (userData && userData.displayName) {
            return userData.displayName.slice(0, 2).toUpperCase();
        } else if (userData && userData.username) {
            return userData.username.slice(0, 2).toUpperCase();
        }
        return "NN";
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const renderActivity = () => (
        <div className="text-center mt-10">
            <div className="text-gray-500 text-5xl mb-4">
                <i className="fas fa-clipboard" />
            </div>
            <p className="text-gray-500">This user hasn’t published any notes yet.</p>
            <p className="text-gray-500 mt-2">
                Once they do, you’ll see them here.
            </p>
            <button className="mt-6 px-4 py-2 bg-senary text-foreground border border-border rounded-lg hover:bg-gray-700 transition">
                Explore more notes
            </button>
        </div>
    );

    const renderPosts = () => {
        const recentPosts = userData?.blogs
            ?.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            ?.slice(0, 5);

        return (
            <div className="mt-6 flex flex-col items-center max-w-3xl space-y-4 mx-auto">
                {recentPosts && recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                        <div key={post._id} className="bg-senary rounded-lg shadow border border-border p-4 w-full">
                            <Link href={`/${userData.username}/blog/${post.slug}`} className="text-md font-semibold hover:underline text-foreground">
                                {post.title}
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">
                        <p>No posts yet.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderLikes = () => (
        <div className="mt-10 text-center text-gray-400">
            <p>No likes yet.</p>
        </div>
    );

    const renderReads = () => (
        <div className="mt-10 text-center text-gray-400">
            <p>No reads yet.</p>
        </div>
    );

    if (loading) {
        return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading profile...</div>;
    }

    if (error || !userData || Object.keys(userData).length === 0) {
        return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">User profile not found.</div>;
    }

    return (
        <div className={`min-h-screen bg-background text-foreground`}>
            <header className="max-w-3xl mx-auto px-4 pt-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">{userData.displayName || userData.username || "User"}</h1>
                        <p className="text-gray-700 text-base">@{userData.username}</p>
                    </div>
                    <div className="w-20 h-20 bg-senary border border-border text-foreground rounded-full overflow-hidden flex items-center justify-center">
                        {userData.photoURL ? (
                            <Image
                                src={userData.photoURL}
                                alt={userData.displayName || userData.username || "User Avatar"}
                                className="w-full h-full object-cover"
                                width={80}
                                height={80}
                            />
                        ) : (
                            <span className="opacity-70 text-3xl font-semibold">
                                {getUserInitials()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 mb-6 space-x-4">
                    <Link
                        href={`/${userData.username}/blog`}
                        className="flex items-center font-semibold justify-center px-4 py-3 bg-secondary rounded-lg text-white transition w-full md:w-1/2"
                    >
                        Blogs
                    </Link>
                    <Link
                        href={`/${userData.username}/portfolio`}
                        className="flex items-center font-semibold justify-center px-4 py-3 bg-senary border border-border text-foreground rounded-lg transition w-full md:w-1/2"
                    >
                        View Portfolio
                    </Link>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center justify-self-end space-x-2 px-4 py-3 rounded-lg bg-senary border border-border text-foreground transition  hover:bg-gray-800 focus:outline-none"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <HiDotsHorizontal className="text-2xl" />
                        </button>
                        <div
                            className={`absolute origin-top-right mt-2 w-48 bg-senary text-foreground rounded-lg shadow-lg z-10 transition duration-150 ease-in-out ${dropdownOpen ? "block" : "hidden"}`}
                            style={{ top: "100%", right: "0px", left: "unset" }}
                        >
                            <button
                                className="flex w-full px-4 py-3 text-left text-sm rounded-t-lg text-foreground hover:bg-secondary focus:outline-none transition duration-150 ease-in-out"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Link copied to clipboard!');
                                }}
                            >
                                <RiShareLine className="mr-2" size={20} /> Copy Link
                            </button>
                            <hr className="border-b border-border" />
                            <button
                                className="flex w-full px-4 py-3 text-left text-sm rounded-b-lg text-foreground hover:bg-secondary focus:outline-none transition duration-150 ease-in-out"
                                onClick={() => {
                                    const shareData = {
                                        title: `${userData.displayName || userData.username || "User"}'s Profile`,
                                        url: window.location.href,
                                    };
                                    navigator.share(shareData);
                                }}
                            >
                                <RiMore2Line className="mr-2" size={20} /> Share
                            </button>
                        </div>
                    </div>
                </div>

                <nav className="border-b border-border">
                    <ul className="flex justify-evenly text-base">
                        <li
                            onClick={() => setActiveTab("activity")}
                            className={`pb-2 cursor-pointer ${
                                activeTab === "activity"
                                    ? "text-orange-500 border-b-2 border-orange-500 text-center"
                                    : "text-gray-700 hover:text-orange-500"
                            }`}
                        >
                            Activity
                        </li>
                        <li
                            onClick={() => setActiveTab("posts")}
                            className={`pb-2 cursor-pointer ${
                                activeTab === "posts"
                                    ? "text-orange-500 border-b-2 border-orange-500 text-center"
                                    : "text-gray-500 hover:text-orange-500"
                            }`}
                        >
                            Posts
                        </li>
                        <li
                            onClick={() => setActiveTab("likes")}
                            className={`pb-2 cursor-pointer ${
                                activeTab === "likes"
                                    ? "text-orange-500 border-b-2 border-orange-500 text-center"
                                    : "text-gray-500 hover:text-orange-500"
                            }`}
                        >
                            Likes
                        </li>
                        <li
                            onClick={() => setActiveTab("reads")}
                            className={`pb-2 cursor-pointer ${
                                activeTab === "reads"
                                    ? "text-orange-500 border-b-2 border-orange-500 text-center"
                                    : "text-gray-500 hover:text-orange-500"
                            }`}
                        >
                            Reads
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {activeTab === "activity" && renderActivity()}
                {activeTab === "posts" && renderPosts()}
                {activeTab === "likes" && renderLikes()}
                {activeTab === "reads" && renderReads()}
            </main>
        </div>
    );
}