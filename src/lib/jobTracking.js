import clientPromise from "@/lib/mongodb";
const jobsCollectionName = 'jobs';

/**
 * Save a new job application to MongoDB.
 * If a job with the same unique identifier (or combination of fields) already exists, you could modify this to update instead.
 */
export async function saveJobToMongoDB(job) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const jobs = db.collection(jobsCollectionName);
        const now = new Date();
        
        // Here you might decide on a unique key for each job.
        // For example, if each job is unique per user per company and role:
        const existingJob = await jobs.findOne({
            email: job.email,
            company: job.company,
            role: job.role,
        });
        
        if (!existingJob) {
            const newJob = {
                email: job.email,            // The user to whom the job belongs
                company: job.company,        // Company name
                role: job.role,              // Job title/position
                status: job.status || 'Applied',  // Default status is "Applied"
                appliedAt: job.appliedAt || now,
                notes: job.notes || '',
                createdAt: now,
                updatedAt: now,
                // Add any additional fields as needed (e.g., contact info, interview date)
            };
            
            await jobs.insertOne(newJob);
            console.log('Job saved to MongoDB');
            return newJob;
        } else {
            console.log('Job already exists in MongoDB, consider updating instead');
            return existingJob;
        }
    } catch (error) {
        console.error('Error saving job to MongoDB:', error);
        throw error;
    }
}

/**
 * Get a job application by its unique identifier (or combination of unique fields).
 */
export async function getJobFromMongoDB(jobId) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const jobs = db.collection(jobsCollectionName);
        
        // Assuming jobId is the MongoDB ObjectId string:
        const { ObjectId } = require('mongodb');
        const job = await jobs.findOne({ _id: new ObjectId(jobId) });
        return job;
    } catch (error) {
        console.error('Error getting job from MongoDB:', error);
        throw error;
    }
}

/**
 * Update job details.
 * jobId is the identifier of the job to update and updateData contains fields to be updated.
 */
export async function updateJobInMongoDB(jobId, updateData) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const jobs = db.collection(jobsCollectionName);
        
        // Set the updatedAt field to the current time.
        updateData.updatedAt = new Date();
        
        const { ObjectId } = require('mongodb');
        const result = await jobs.updateOne(
            { _id: new ObjectId(jobId) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            throw new Error('Job not found');
        }
        
        console.log('Job updated in MongoDB:', result);
        return result;
    } catch (error) {
        console.error('Error updating job in MongoDB:', error);
        throw error;
    }
}

/**
 * Retrieve all job applications.
 * Optionally, filter by user email.
 */
export async function getAllJobsFromMongoDB(email = null) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const jobs = db.collection(jobsCollectionName);
        
        const query = email ? { email: email } : {};
        const allJobs = await jobs.find(query).toArray();
        return allJobs;
    } catch (error) {
        console.error('Error getting all jobs from MongoDB:', error);
        throw error;
    }
}

/**
 * Switch job status (for example, from "Applied" to "Interview", "Offer", or "Rejected").
 * This is just an example of toggling status. You might implement more sophisticated transitions.
 */
export async function switchJobStatus(jobId, newStatus) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const jobs = db.collection(jobsCollectionName);
        
        const { ObjectId } = require('mongodb');
        const result = await jobs.updateOne(
            { _id: new ObjectId(jobId) },
            { $set: { status: newStatus, updatedAt: new Date() } }
        );
        
        if (result.modifiedCount === 1) {
            console.log(`✅ Job status updated to ${newStatus}`);
            return { status: newStatus };
        } else {
            throw new Error("Failed to update job status.");
        }
    } catch (error) {
        console.error("❌ Error switching job status in MongoDB:", error);
        throw error;
    }
}

/**
 * Delete a job application by its unique identifier.
 */
export async function deleteJobFromMongoDB(jobId) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const jobs = db.collection(jobsCollectionName);
        
        const { ObjectId } = require('mongodb');
        const result = await jobs.deleteOne({ _id: new ObjectId(jobId) });
        
        if (result.deletedCount === 1) {
            console.log('Job deleted from MongoDB');
            return { success: true };
        } else {
            throw new Error('Job not found');
        }
    } catch (error) {
        console.error('Error deleting job from MongoDB:', error);
        throw error;
    }
}

