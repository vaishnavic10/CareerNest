// lib/syntaxHighlighter.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const blogPostsCollectionName = 'blogPosts';

export async function addBlogPost(email, newPost) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const blogPosts = db.collection(blogPostsCollectionName);
        const result = await blogPosts.insertOne({
            ...newPost,
            authorEmail: email, // Store the email
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return result;
    } catch (error) {
        console.error('Error adding blog post:', error);
        throw error;
    }
}

export async function getBlogPostBySlug(slug) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const blogPosts = db.collection(blogPostsCollectionName);
        const post = await blogPosts.findOne({ slug });
        return post;
    } catch (error) {
        console.error('Error getting blog post by slug:', slug, error);
        throw error;
    }
}

export async function getAllBlogPosts() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const blogPostsCollection = db.collection(blogPostsCollectionName);
        const usersCollection = db.collection('users'); // Assuming your users are in a collection named 'users'
        
        const posts = await blogPostsCollection.find({}).sort({ date: -1 }).toArray();
        
        // Fetch user data for each blog post
        const postsWithAuthorInfo = await Promise.all(
            posts.map(async (post) => {
                try {
                    const user = await usersCollection.findOne({ email: post.authorEmail });
                    if (user) {
                        return {
                            ...post,
                            authorUsername: user.username,
                            authorDisplayName: user.displayName,
                        };
                    } else {
                        return {
                            ...post,
                            authorUsername: 'Unknown User',
                            authorDisplayName: 'Unknown User',
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching user for email ${post.authorEmail}:`, error);
                    return {
                        ...post,
                        authorUsername: 'Error',
                        authorDisplayName: 'Error',
                    };
                }
            })
        );
        
        return postsWithAuthorInfo;
    } catch (error) {
        console.error('Error getting all blog posts with author info:', error);
        throw error;
    }
}

export async function getBlogPostsByAuthor(email) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const blogPosts = db.collection(blogPostsCollectionName);
        const posts = await blogPosts.find({ authorEmail: email }).sort({ date: -1 }).toArray();
        return posts;
    } catch (error) {
        console.error('Error getting blog posts by author:', error);
        throw error;
    }
}

export async function updateBlogPost(email, postId, updatedPost) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const blogPosts = db.collection(blogPostsCollectionName);
        
        // Retrieve the existing post to verify ownership
        const existingPost = await blogPosts.findOne({ _id: new ObjectId(postId) });
        if (!existingPost) {
            throw new Error('Blog post not found');
        }
        if (existingPost.authorEmail !== email) {
            throw new Error('Unauthorized: You can only update your own blog post');
        }
        
        const result = await blogPosts.updateOne(
            { _id: new ObjectId(postId) },
            { $set: { ...updatedPost, authorEmail: email, updatedAt: new Date() } }
        );
        return result;
    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
}

export async function deleteBlogPost(email, postId) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const blogPosts = db.collection(blogPostsCollectionName);
        const result = await blogPosts.deleteOne({ _id: new ObjectId(postId) });
        return result;
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}