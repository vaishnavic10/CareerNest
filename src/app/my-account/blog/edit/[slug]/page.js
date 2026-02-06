"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import InputBox from "@/components/Input";
import Button from "@/components/Button";
import CustomTextEditor from "@/components/CustomTextEditor";
import { slugify } from "@/utils/slugify";
import useBlog from "@/hooks/useBlog";
import { useAuth } from "@/context/authContext.js"; // Assuming the hook is in this path
import { IoIosClose } from "react-icons/io";
import { toast } from "react-hot-toast";
import useTabTitle from "@/hooks/useTabTitle.js";

const BlogEditPage = () => {
    useTabTitle("Edit Blog Post");
    const { user } = useAuth();
    const userEmail = user?.email;
    const router = useRouter();
    const { slug } = useParams();
    const isNewPost = slug === "new";
    const {
        loading,
        error,
        blogPost,
        getBlogPostBySlug,
        addBlogPost,
        updateBlogPost,
    } = useBlog();
    
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        date: new Date().toISOString().split("T")[0],
        content: "",
        bannerImage: "",
        tags: [],
    });
    const [newTag, setNewTag] = useState("");
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Use a ref to track if unauthorized toast was already shown
    const unauthorizedToastShown = useRef(false);
    
    useEffect(() => {
        if (!isNewPost && slug) {
            getBlogPostBySlug(slug);
        } else if (isNewPost) {
            setFormData({
                title: "",
                slug: "",
                date: new Date().toISOString().split("T")[0],
                content: "",
                bannerImage: "",
                tags: [],
            });
            setIsSlugManuallyEdited(false);
        }
    }, [slug, isNewPost, getBlogPostBySlug]);
    
    useEffect(() => {
        if (blogPost) {
            // Check if the current user is not the owner
            if (blogPost.authorEmail !== userEmail) {
                // Only show the toast once
                if (!unauthorizedToastShown.current) {
                    unauthorizedToastShown.current = true;
                    toast.error("You are not authorized to edit this post.");
                }
                router.push("/my-account/blog");
                return;
            }
            setIsSlugManuallyEdited(true);
            let tagsArray = [];
            if (blogPost.tags) {
                if (Array.isArray(blogPost.tags)) {
                    tagsArray = blogPost.tags;
                } else if (typeof blogPost.tags === "string") {
                    tagsArray = blogPost.tags.split(",").map((tag) => tag.trim());
                }
            }
            setFormData((prev) => ({ ...prev, ...blogPost, tags: tagsArray }));
        }
    }, [blogPost, userEmail, router]);
    
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name === "slug") {
            setIsSlugManuallyEdited(true);
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);
    
    const handleNewTagChange = (e) => {
        setNewTag(e.target.value);
    };
    
    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
            setNewTag("");
        }
    };
    
    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };
    
    useEffect(() => {
        if (isNewPost && !isSlugManuallyEdited) {
            if (formData.title) {
                setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }));
            } else {
                setFormData((prev) => ({ ...prev, slug: "" }));
            }
        }
    }, [formData.title, isNewPost, isSlugManuallyEdited]);
    
    const handleContentChange = useCallback((value) => {
        setFormData((prev) => ({ ...prev, content: value }));
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Form Data on Submit:", formData);
        
        try {
            if (isNewPost) {
                const result = await addBlogPost(formData);
                if (result) {
                    toast.success("New post saved successfully!");
                    router.push("/my-account/blog");
                } else {
                    toast.error("Error saving new post.");
                    console.error("Error saving new post.");
                }
            } else if (blogPost?._id) {
                const result = await updateBlogPost(blogPost._id, formData);
                if (result) {
                    toast.success("Post updated successfully!");
                    router.push("/my-account/blog");
                } else {
                    toast.error("Error updating post.");
                    console.error("Error updating post.");
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return <p>Loading blog post...</p>;
    }
    
    if (error) {
        return <p>Error loading blog post: {error}</p>;
    }
    
    return (
        <div className="container min-h-screen mx-auto mb-16 p-2">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                        {isNewPost ? "Add New Post" : "Edit Post"}
                    </h1>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <InputBox
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full md:w-auto"
                        />
                        <div className="flex space-x-4">
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting
                                    ? isNewPost
                                        ? "Saving..."
                                        : "Updating..."
                                    : isNewPost
                                        ? "Save New Post"
                                        : "Update Post"}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => router.push("/my-account/blog")}
                                variant="gray"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputBox
                        name="title"
                        placeholder="Enter title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <InputBox
                        name="slug"
                        placeholder="Enter slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                    />
                </div>
                <InputBox
                    name="bannerImage"
                    placeholder="Enter banner image URL"
                    value={formData.bannerImage}
                    onChange={handleChange}
                />
                <div>
                    <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(formData.tags) &&
                            formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-senary border border-border rounded-xl px-2 py-0.5 text-sm flex items-center"
                                >
                  {tag}
                                    <IoIosClose
                                        className=" text-danger cursor-pointer ml-1"
                                        size={16}
                                        onClick={() => handleRemoveTag(tag)}
                                    />
                </span>
                            ))}
                    </div>
                    <div className="flex space-x-2">
                        <InputBox
                            type="text"
                            value={newTag}
                            onChange={handleNewTagChange}
                            placeholder="Add Tag"
                            className="flex-grow mt-1"
                        />
                        <Button
                            type="button"
                            onClick={handleAddTag}
                            variant="secondary"
                            size="sm"
                            disabled={isSubmitting}
                        >
                            Add
                        </Button>
                    </div>
                </div>
                <div>
                    <label htmlFor="content" className="mb-1 block text-sm text-foreground">
                        Content
                    </label>
                    <CustomTextEditor
                        id="content"
                        value={formData.content}
                        onChange={handleContentChange}
                        className="min-h-[200px] no-scrollbar resizable-editor"
                    />
                </div>
            </form>
        </div>
    );
};

export default BlogEditPage;
