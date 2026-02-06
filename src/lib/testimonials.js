// TestimonialsSection.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const testimonialCollectionName = 'testimonials';

// --- Adding a Testimonial (Admin Only) ---
export async function addTestimonialByAdmin(testimonialData) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const testimonials = db.collection(testimonialCollectionName);
        const now = new Date();
        
        const result = await testimonials.insertOne({
            ...testimonialData,
            createdAt: now,
            updatedAt: now,
        });
        
        console.log('New testimonial added by admin:', result);
        return result;
    } catch (error) {
        console.error('Error adding testimonial by admin:', error);
        throw error;
    }
}

// --- Getting Testimonials for a Specific User ---
export async function getTestimonialsForUser(userEmail) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const testimonials = db.collection(testimonialCollectionName);
        
        const userTestimonials = await testimonials.find({ userEmail: userEmail }).toArray();
        return userTestimonials;
    } catch (error) {
        console.error('Error getting testimonials for user:', userEmail, error);
        throw error;
    }
}

// --- Getting All Testimonials (Admin Functionality) ---
export async function getAllTestimonials() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const testimonials = db.collection(testimonialCollectionName);
        
        const allTestimonials = await testimonials.find({}).toArray();
        return allTestimonials;
    } catch (error) {
        console.error('Error getting all testimonials:', error);
        throw error;
    }
}

// TestimonialsSection.js

export async function updateTestimonialByAdmin(testimonialId, updatedTestimonial) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const testimonials = db.collection(testimonialCollectionName);
        const now = new Date();
        
        // Create a copy of updatedTestimonial and remove _id if it exists
        const updateData = { ...updatedTestimonial };
        delete updateData._id;
        
        const result = await testimonials.updateOne(
            { _id: new ObjectId(testimonialId) },
            { $set: { ...updateData, updatedAt: now } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Testimonial with ID "${testimonialId}" not found.`);
        }
        
        console.log(`Testimonial with ID "${testimonialId}" updated by admin:`, result);
        return result;
    } catch (error) {
        console.error(`Error updating testimonial with ID "${testimonialId}" by admin:`, error);
        throw error;
    }
}


// --- Deleting a Testimonial (Admin Only) ---
export async function deleteTestimonialByAdmin(testimonialId) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const testimonials = db.collection(testimonialCollectionName);
        
        const result = await testimonials.deleteOne({ _id: new ObjectId(testimonialId) });
        
        if (result.deletedCount === 0) {
            console.log(`Testimonial with ID "${testimonialId}" not found.`);
            return { deleted: false, message: `Testimonial with ID "${testimonialId}" not found.` };
        }
        
        console.log(`Testimonial with ID "${testimonialId}" deleted by admin:`, result);
        return { deleted: true, message: `Testimonial with ID "${testimonialId}" deleted successfully.` };
    } catch (error) {
        console.error(`Error deleting testimonial with ID "${testimonialId}" by admin:`, error);
        throw error;
    }
}