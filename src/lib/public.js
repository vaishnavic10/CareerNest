import clientPromise from "@/lib/mongodb";
const portfolioCollectionName = 'portfolios';
const blogPostsCollectionName = 'blogPosts'; // Add blog posts collection name

export async function publicUserProfile(username) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');
        const portfoliosCollection = db.collection(portfolioCollectionName);
        const blogPostsCollection = db.collection(blogPostsCollectionName); // Get blog posts collection
        
        // Find the user by their username
        const user = await usersCollection.findOne({ username });
        
        if (!user) {
            return null; // User not found
        }
        
        const portfolio = await portfoliosCollection.findOne({ email: user.email });
        
        if (!portfolio) {
            return null; // Portfolio not found for this user (shouldn't happen if saveUserToMongoDB works correctly)
        }
        
        // Find the user's blog posts
        const blogs = await blogPostsCollection.find({ authorEmail: user.email }).sort({ createdAt: -1 }).toArray();
        
        // Shape the data you want to expose publicly
        const publicProfileData = {
            displayName: user.displayName,
            username: user.username,
            photoURL: user.photoURL,
            email: user.email,
            title: portfolio.title,
            bio: portfolio.bio,
            phone: portfolio.phone,
            location: portfolio.location,
            socialLinks: portfolio.socialLinks,
            experience: portfolio.experience,
            education: portfolio.education,
            projects: portfolio.projects,
            skills: portfolio.skills,
            blogs: blogs.map(blog => ({ // Shape the blog data as needed
                _id: blog._id.toString(),
                title: blog.title,
                slug: blog.slug,
                content: blog.content,
                date: blog.date,
                bannerImage: blog.bannerImage,
                tags: blog.tags,
            })),
            // You might choose to exclude contactInfo or other sensitive data
        };
        
        return publicProfileData;
        
    } catch (error) {
        console.error('Error fetching public user profile from MongoDB:', error);
        throw error;
    }
}

