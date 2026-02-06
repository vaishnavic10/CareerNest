'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Mock data storage
const posts = []

export async function createBlogAction(data) {
    // Validate data
    if (!data.title || !data.slug || !data.content) {
        return { error: 'All fields are required.' }
    }
    
    // Check for duplicate slug
    const existingPost = posts.find(post => post.slug === data.slug)
    if (existingPost) {
        return { error: 'That slug already exists.' }
    }
    
    // Create blog post
    const post = { id: posts.length + 1, ...data }
    posts.push(post)
    
    revalidatePath('/')
    redirect(`/blog/${post.slug}`)
}
