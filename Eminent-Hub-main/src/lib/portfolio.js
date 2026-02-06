// portfolio.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const portfolioCollectionName = 'portfolios';

// --- Adding Particular Items ---

export async function addProjectToPortfolio(email, newProject) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email },
            { $push: { projects: { _id: new ObjectId(), ...newProject } } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log('New project added to portfolio for email:', email, result);
        return result;
    } catch (error) {
        console.error('Error adding project to portfolio for email:', email, error);
        throw error;
    }
}

export async function addSkillCategoryToPortfolio(email, newCategory) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email },
            { $push: { skills: newCategory } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log('New skill category added to portfolio for email:', email, result);
        return result;
    } catch (error) {
        console.error('Error adding skill category to portfolio for email:', email, error);
        throw error;
    }
}

export async function addSkillToCategory(email, categoryName, newSkill) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email, 'skills.category': categoryName },
            { $push: { 'skills.$.items': newSkill } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Portfolio or skill category "${categoryName}" not found for email: ${email}`);
        }
        
        console.log(`New skill "${newSkill}" added to category "${categoryName}" for email: ${email}`, result);
        return result;
    } catch (error) {
        console.error(`Error adding skill "${newSkill}" to category "${categoryName}" for email: ${email}`, error);
        throw error;
    }
}

export async function addEducationEntry(email, newEducation) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email },
            { $push: { education: { _id: new ObjectId(), ...newEducation } } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log('New education entry added for email:', email, result);
        return result;
    } catch (error) {
        console.error('Error adding education entry for email:', email, error);
        throw error;
    }
}

export async function addExperienceEntry(email, newExperience) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        
        const result = await portfolios.updateOne(
            { email: email },
            { $push: { experience: { _id: new ObjectId(), ...newExperience } } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log('New experience entry added for email:', email, result);
        return result;
    } catch (error) {
        console.error('Error adding experience entry for email:', email, error);
        throw error;
    }
}

// --- Updating Particular Items ---
export async function updatePersonalInformation(email, updateData) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email },
            {
                $set: {
                    title: updateData.title,
                    bio: updateData.bio,
                    socialLinks: updateData.socialLinks,
                    location: updateData.location,     // Added location
                    phone: updateData.phone,           // Added phone number
                    updatedAt: new Date()
                }
            }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log('Personal information updated for email:', email, result);
        return result;
    } catch (error) {
        console.error('Error updating personal information for email:', email, error);
        throw error;
    }
}


export async function updateProjectInPortfolio(email, projectId, updatedProject) {
    try {
        // Preserve the original _id as a string
        updatedProject._id = projectId;
        
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email, 'projects._id': projectId },
            { $set: { 'projects.$': updatedProject } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Project with ID "${projectId}" not found in portfolio for email: ${email}`);
        }
        
        return result;
    } catch (error) {
        console.error(`Error updating project with ID "${projectId}" for email: ${email}`, error);
        throw error;
    }
}


export async function updateSkillCategory(email, categoryName, updatedCategory) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email, 'skills.category': categoryName },
            { $set: { 'skills.$': updatedCategory } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Skill category "${categoryName}" not found for email: ${email}`);
        }
        
        console.log(`Skill category "${categoryName}" updated for email: ${email}`, result);
        return result;
    } catch (error) {
        console.error(`Error updating skill category "${categoryName}" for email: ${email}`, error);
        throw error;
    }
}

export async function updateEducationEntry(email, educationId, updatedEducation) {
    try {
        // Convert the string ID to an ObjectId
        const eduObjectId = new ObjectId(educationId);
        updatedEducation._id = eduObjectId;
        
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email, 'education._id': eduObjectId },
            { $set: { 'education.$': updatedEducation } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Education entry with ID "${educationId}" not found for email: ${email}`);
        }
        
        console.log(`Education entry with ID "${educationId}" updated for email: ${email}`, result);
        return result;
    } catch (error) {
        console.error(`Error updating education entry with ID "${educationId}" for email: ${email}`, error);
        throw error;
    }
}

export async function updateExperienceEntry(email, experienceId, updatedExperience) {
    try {
        updatedExperience._id = experienceId; // Ensure _id is an ObjectId
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email, "experience._id": experienceId },
            { $set: { "experience.$": updatedExperience } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Experience entry with ID "${experienceId}" not found for email: ${email}`);
        }
        
        return result;
    } catch (error) {
        console.error(`Error updating experience entry with ID "${experienceId}" for email: ${email}`, error);
        throw error;
    }
}

// --- Deleting Particular Items ---
export async function deleteProjectFromPortfolio(email, projectId) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        // Remove the project whose _id matches the projectId string.
        const result = await portfolios.updateOne(
            { email },
            { $pull: { projects: { _id: projectId } } }
        );
        
        if (result.modifiedCount === 0 && result.matchedCount > 0) {
            console.log(`Project with ID "${projectId}" not found in portfolio for email: ${email}`);
            return { matched: true, deleted: false, message: `Project with ID "${projectId}" not found.` };
        } else if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log(`Project with ID "${projectId}" deleted from portfolio for email: ${email}`, result);
        return { matched: true, deleted: true, message: `Project with ID "${projectId}" deleted successfully.` };
        
    } catch (error) {
        console.error(`Error deleting project with ID "${projectId}" from portfolio for email: ${email}`, error);
        throw error;
    }
}



export async function deleteSkillCategory(email, categoryName) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email },
            { $pull: { skills: { category: categoryName } } }
        );
        
        if (result.modifiedCount === 0 && result.matchedCount > 0) {
            console.log(`Skill category "${categoryName}" not found in portfolio for email: ${email}`);
            return { matched: true, deleted: false, message: `Skill category "${categoryName}" not found.` };
        } else if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log(`Skill category "${categoryName}" deleted from portfolio for email: ${email}`, result);
        return { matched: true, deleted: true, message: `Skill category "${categoryName}" deleted successfully.` };
        
    } catch (error) {
        console.error(`Error deleting skill category "${categoryName}" from portfolio for email: ${email}`, error);
        throw error;
    }
}

export async function deleteSkillFromCategory(email, categoryName, skillToRemove) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email: email, 'skills.category': categoryName },
            { $pull: { 'skills.$.items': skillToRemove } }
        );
        
        if (result.modifiedCount === 0 && result.matchedCount > 0) {
            console.log(`Skill "${skillToRemove}" not found in category "${categoryName}" for email: ${email}`);
            return { matched: true, deleted: false, message: `Skill "${skillToRemove}" not found in category "${categoryName}".` };
        } else if (result.matchedCount === 0) {
            throw new Error(`Portfolio or skill category "${categoryName}" not found for email: ${email}`);
        }
        
        console.log(`Skill "${skillToRemove}" deleted from category "${categoryName}" for email: ${email}`, result);
        return { matched: true, deleted: true, message: `Skill "${skillToRemove}" deleted from category "${categoryName}" successfully.` };
        
    } catch (error) {
        console.error(`Error deleting skill "${skillToRemove}" from category "${categoryName}" for email: ${email}`, error);
        throw error;
    }
}

export async function deleteEducationEntry(email, educationId) {
    try {
        // Convert the string ID to an ObjectId
        const eduObjectId = new ObjectId(educationId);
        
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email },
            { $pull: { education: { _id: eduObjectId } } }
        );
        
        if (result.modifiedCount === 0 && result.matchedCount > 0) {
            console.log(`Education entry with ID "${educationId}" not found for email: ${email}`);
            return { matched: true, deleted: false, message: `Education entry with ID "${educationId}" not found.` };
        } else if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log(`Education entry with ID "${educationId}" deleted for email: ${email}`, result);
        return { matched: true, deleted: true, message: `Education entry with ID "${educationId}" deleted successfully.` };
        
    } catch (error) {
        console.error(`Error deleting education entry with ID "${educationId}" for email: ${email}`, error);
        throw error;
    }
}


export async function deleteExperienceEntry(email, experienceId) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const result = await portfolios.updateOne(
            { email },
            { $pull: { experience: { _id: experienceId } } }
        );
        
        if (result.modifiedCount === 0 && result.matchedCount > 0) {
            console.log(`Experience entry with ID "${experienceId}" not found for email: ${email}`);
            return { matched: true, deleted: false, message: `Experience entry with ID "${experienceId}" not found.` };
        } else if (result.matchedCount === 0) {
            throw new Error(`Portfolio not found for email: ${email}`);
        }
        
        console.log(`Experience entry with ID "${experienceId}" deleted for email: ${email}`, result);
        return { matched: true, deleted: true, message: `Experience entry with ID "${experienceId}" deleted successfully.` };
        
    } catch (error) {
        console.error(`Error deleting experience entry with ID "${experienceId}" for email: ${email}`, error);
        throw error;
    }
}


// --- Utility Function to Generate Unique IDs ---
export function generateUniqueId() {
    return new ObjectId().toHexString();
}

// --- Get Portfolio by Email ---
export async function getPortfolioFromMongoDB(email) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const portfolios = db.collection(portfolioCollectionName);
        
        const portfolio = await portfolios.findOne({ email: email });
        console.log('Portfolio data for email:', email, portfolio);
        return portfolio;
    } catch (error) {
        console.error('Error getting portfolio from MongoDB for email:', email, error);
        throw error;
    }
}