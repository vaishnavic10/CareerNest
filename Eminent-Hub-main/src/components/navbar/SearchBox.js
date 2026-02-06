"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";
import InputBox from "@/components/Input.js";
import useClickOutside from "@/hooks/useClickOutside";

export default function SearchBox({ isMobile, onResultClick }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    
    // Close search dropdown when clicking outside
    useClickOutside(dropdownRef, () => {
        if (showSearchDropdown) setShowSearchDropdown(false);
    });
    
    const debouncedSearch = useCallback((query) => {
        if (query.trim()) {
            setIsSearching(true);
            setSearchResults(null);
            fetch(`/api/search-users?query=${query}`)
                .then((response) => {
                    if (!response.ok) {
                        setSearchResults({ error: "Search failed" });
                    }
                    return response.json();
                })
                .then((data) => {
                    setSearchResults(data);
                })
                .catch(() => {
                    setSearchResults({ error: "Error during search" });
                })
                .finally(() => {
                    setIsSearching(false);
                });
        } else {
            setSearchResults(null);
            setShowSearchDropdown(false);
        }
    }, []);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            debouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, debouncedSearch]);
    
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSearchDropdown(true);
    };
    
    return (
        <div className={`relative ${isMobile ? "md:hidden" : "hidden md:flex"} items-center`}>
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                <InputBox
                    ref={inputRef}
                    type="text"
                    placeholder="Search users or blog titles..."
                    className="w-full px-3 py-2 bg-senary/98 shadow-lg border border-border rounded focus:outline-none focus:ring focus:ring-primary"
                    
                    icon={<RiSearchLine size={20} className="text-foreground" />}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setShowSearchDropdown(searchQuery.trim() !== "")}
                />
            </form>
            {showSearchDropdown && (
                <div
                    ref={dropdownRef}
                    className={`${
                        isMobile
                            ? "mt-2 max-w-2xl"
                            : "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 max-w-md"
                    } w-full bg-senary backdrop-blur-md border border-border rounded shadow-md z-20`}
                >
                    {isSearching ? (
                        <p className="p-2 text-sm text-center">Searching...</p>
                    ) : searchResults?.error ? (
                        <p className="p-2 text-sm text-warning">{searchResults.error}</p>
                    ) : searchResults ? (
                        <>
                            {searchResults.users && searchResults.users.length > 0 && (
                                <div className="p-2 border-b border-border">
                                    <h3 className="font-semibold text-sm mb-1">Users</h3>
                                    <ul>
                                        {searchResults.users.map((user, index) => (
                                            <li key={user.uid || index} className="py-1">
                                                <Link
                                                    href={`/${user.username}`}
                                                    onClick={onResultClick}
                                                    className="flex text-sm p-1"
                                                >
                                                    {user.photoURL && (
                                                        <Image
                                                            src={user.photoURL}
                                                            alt={user.displayName}
                                                            width={35}
                                                            height={35}
                                                            className="rounded-full mr-2 object-cover"
                                                            onError={() => console.error("Error loading user image")}
                                                        />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span>{user.displayName}</span>
                                                        <span className="text-xs text-gray-500">@{user.username}</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {searchResults.blogPosts && searchResults.blogPosts.length > 0 && (
                                <div className="p-2">
                                    <h3 className="font-semibold text-sm mb-1">Blog Posts</h3>
                                    <ul>
                                        {searchResults.blogPosts.map((post, index) => (
                                            <li key={post.slug || index} className="py-1">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    onClick={onResultClick}
                                                    className="block hover:underline text-sm p-1"
                                                >
                                                    {post.bannerImage && (
                                                        <div className="relative w-full h-16 mb-1 rounded-md overflow-hidden">
                                                            <Image
                                                                src={post.bannerImage}
                                                                alt={post.title}
                                                                layout="fill"
                                                                objectFit="cover"
                                                                onError={() => console.error("Error loading blog banner image")}
                                                            />
                                                        </div>
                                                    )}
                                                    <span className="font-semibold">{post.title}</span>
                                                    {post.author && (
                                                        <p className="text-xs text-gray-600">
                                                            by {post.author.displayName || post.author.username || "Unknown"}
                                                        </p>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {(!searchResults.users ||
                                    searchResults.users.length === 0) &&
                                (!searchResults.blogPosts ||
                                    searchResults.blogPosts.length === 0) &&
                                searchQuery.trim() !== "" && (
                                    <p className="p-2 text-sm text-center">Not found</p>
                                )}
                        </>
                    ) : searchQuery.trim() !== "" ? (
                        <p className="p-2 text-sm text-center">Searching...</p>
                    ) : (
                        <p className="p-2 text-sm text-center">Start typing to see results...</p>
                    )}
                </div>
            )}
        </div>
    );
}
