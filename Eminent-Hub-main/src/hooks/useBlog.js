// hooks/useBlog.js
import { useState, useCallback } from 'react';
import { useAuth } from "@/context/authContext.js";
import {fetchData} from "@/utils/fetchData.js";

const useBlog = () => {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogPost, setBlogPost] = useState(null);
    
    const getAllBlogPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchData('/api/blog', 'GET', null, token);
            setBlogPosts(data);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token]);
    

    
    const getBlogPostBySlug = useCallback(async (slug) => {
        setLoading(true);
        setError(null);
        setBlogPost(null);
        try {
            const data = await fetchData(`/api/blog/${slug}`, 'GET', null, token);
            setBlogPost(data);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token]);
    
    const addBlogPost = useCallback(async (newPost) => {
        if (!user?.email) {
            setError('Email is required to add a blog post.');
            return null;
        }
        return fetchData('/api/blog', 'POST', { email: user.email, ...newPost }, token);
    }, [token, user?.email]);
    
    const updateBlogPost = useCallback(async (postId, updatedPost) => {
        if (!user?.email) {
            setError('Email is required to update a blog post.');
            return null;
        }
        return fetchData(`/api/blog/${updatedPost.slug}`, 'PUT', { email: user.email, _id: postId, ...updatedPost }, token);
    }, [token, user?.email]);
    
    const deleteBlogPost = useCallback(async (postId) => {
        if (!user?.email) {
            setError('Email is required to delete a blog post.');
            return null;
        }
        return fetchData(`/api/blog/${blogPost?.slug}`, 'DELETE', { email: user.email, id: postId }, token);
    }, [token, user?.email, blogPost?.slug]);
    
    const getBlogPostsByAuthor = useCallback(async (authorEmail) => {
        setLoading(true);
        setError(null);
        try {
            // Use provided email or fall back to the current user's email
            const email = authorEmail || user?.email;
            if (!email) {
                throw new Error('Email is required to fetch blog posts by author.');
            }
            const data = await fetchData(`/api/blog/author?email=${encodeURIComponent(email)}`, 'GET', null, token);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token, user?.email]);
    
    return {
        loading,
        error,
        blogPosts,
        blogPost,
        getAllBlogPosts,
        getBlogPostsByAuthor,
        getBlogPostBySlug,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
    };
};

export default useBlog;