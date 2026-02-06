"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";

import Footer from "@/components/Footer.js";
import TableOfContents from "@/components/blog/TableOfContents.js";

import { useParams } from "next/navigation";
import { extractLanguageFromHtml, renderCodeBlock } from "@/utils/syntaxHighlighter.js";
import useUserProfile from "@/hooks/useUserProfile.js";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function BlogPostPage() {
    useTabTitle("Blog Post"); // Set the tab title
    const {username, slug} = useParams();
    const {userData, loading, error} = useUserProfile(username);
    const [blogPost, setBlogPost] = useState(null);
    
    useEffect(() => {
        if (userData?.blogs && slug) {
            const foundPost = userData.blogs.find(post => post.slug === slug);
            setBlogPost(foundPost);
        }
    }, [userData?.blogs, slug]);
    
    if (loading) {
        return (
            <div className="container mx-auto p-6 text-center">
                <p className="text-lg">Loading blog post...</p>
            </div>
        );
    }
    
    if (error || !blogPost) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-semibold mb-4">Error loading blog post</h1>
                <Link href={`/blog`} className="text-blue-500 hover:underline">
                    Back to Blog
                </Link>
            </div>
        );
    }
    
    // Formatting content: adding IDs and custom classes to headings and typography elements
    const modifiedContent = blogPost?.content
        ? blogPost.content
            .replace(/<h2[^>]*>(.*?)<\/h2>/g, (_, headingText) => {
                const id = headingText.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase();
                return `<h2 id="${id}" class="text-3xl font-bold mt-8 mb-4">${headingText}</h2>`;
            })
            .replace(/<h3[^>]*>(.*?)<\/h3>/g, (_, headingText) => {
                const id = headingText.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase();
                return `<h3 id="${id}" class="text-2xl font-semibold mt-6 mb-3">${headingText}</h3>`;
            })
            .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gs, (_, content) => {
                return `<blockquote class="border-l-4 bg-senary border-secondary pl-4 py-3.5 rounded-md m-2 italic text-foreground">${content}</blockquote>`;
            })
            
            // Bold text
            .replace(/<(?:b|strong)[^>]*>(.*?)<\/(?:b|strong)>/gs, (_, text) => {
                return `<strong class="font-bold text-foreground">${text}</strong>`;
            })
            
            .replace(/<ul[^>]*>(.*?)<\/ul>/gs, (_, listContent) => {
                return `<ul class="list-disc space-y-2 pl-6 my-4 text-foreground/90">${listContent}</ul>`; // Added space-y-2
            })
            // Decimal list - handles single items and sub-lists correctly by default HTML behavior
            // .replace(/<ol[^>]*>(.*?)<\/ol>/gs, (_, listContent) => {
            //     return `<ol class="list-decimal space-y-2 pl-6 my-4 text-foreground/90">${listContent}</ol>`; // Changed </ul> to </ol>
            // })
            .replace(/<hr[^>]*>/gs, () => `<hr class="border-t border-tertiary/50 my-6" />`)
            
            // Italic
            .replace(/<(?:i|em)[^>]*>(.*?)<\/(?:i|em)>/gs, (_, inner) => `<em class="italic text-foreground/90">${inner}</em>`)
            // Underline
            .replace(/<u[^>]*>(.*?)<\/u>/gs, (_, inner) => `<span class="underline">${inner}</span>`)
        : "";
            
        
    // Extracting headings for TOC
    const headingRegex = /<(h[23]) id="([^"]+)"[^>]*>(.*?)<\/h[23]>/g;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(modifiedContent)) !== null) {
        const headingText = match[3].replace(/<\/?[^>]+(>|$)/g, "").trim();
        headings.push({
            level: match[1] === "h2" ? 2 : 3,
            id: match[2],
            text: headingText,
        });
    }
    
    // Organize TOC structure
    const toc = [];
    let currentH2 = null;
    headings.forEach((heading) => {
        if (heading.level === 2) {
            currentH2 = { ...heading, children: [] };
            toc.push(currentH2);
        } else if (heading.level === 3 && currentH2) {
            currentH2.children.push({ ...heading });
        }
    });
    
    // Render blog content with syntax highlighting for code blocks
    const renderContent = (htmlString) => {
        return parse(htmlString, {
            replace: (domNode) => {
                if (domNode.name === "pre" && domNode.children && domNode.children.length > 0) {
                    const codeElement = domNode.children.find(child => child.name === "code");
                    if (codeElement) {
                        const language = extractLanguageFromHtml(codeElement.attribs.class || "");
                        const code = codeElement.children.map(node => node.data).join("") || "";
                        return renderCodeBlock(language || "javascript", code, Math.random());
                    }
                }
            }
        });
    };
    
    return (
        <>
            <div className="container mx-auto p-6 max-w-8xl">
                {/* Breadcrumb Navigation */}
                <nav className="text-sm mb-6">
                    <ol className="list-reset flex text-gray-500">
                        <li>
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li>
                            <Link href={`/blog`} className="hover:underline">
                                Blog
                            </Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li className="text-foreground truncate font-semibold">
                            {blogPost?.title}
                        </li>
                    </ol>
                </nav>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Table of Contents */}
                    <aside className="lg:w-1/4">
                        <TableOfContents toc={toc} />
                    </aside>
                    
                    {/* Blog Content */}
                    <main className="lg:w-3/4">
                        {blogPost?.bannerImage && (
                            <div className="relative w-full h-64 mb-6">
                                <Image
                                    src={blogPost.bannerImage}
                                    alt={blogPost.title}
                                    fill
                                    className="object-cover rounded-lg  bg-background border border-border"
                                />
                            </div>
                        )}
                        <h1 className="text-4xl font-bold mb-4">{blogPost?.title}</h1>
                        <div className="flex items-center text-gray-600 text-sm mb-4">
                            {userData?.photoURL ? (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-2">
                                    <Image
                                        src={userData.photoURL}
                                        alt={userData.displayName || userData.username || "Author Avatar"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{backgroundColor: "#ccc"}}
                                    className="rounded-full shadow-md border border-border mr-2 w-12 h-12 flex items-center justify-center"
                                >
                                    {userData?.displayName?.slice(0, 2).toUpperCase() || userData?.username?.slice(0, 2).toUpperCase() || "AU"}
                                </div>
                            )}
                            <span className="flex flex-col">
                                <span
                                    className="text-base font-semibold">By {userData?.displayName || userData?.username || "Author"}</span>
                                <span
                                    className="text-sm">Published on {new Date(blogPost?.date).toLocaleDateString()}</span>
                            </span>
                        </div>
                        
                        <div className="prose prose-indigo max-w-none text-base">
                            {renderContent(modifiedContent)}
                        </div>
                    </main>
                </div>
            </div>
            <Footer/>
        </>
    );
}
