import clientPromise from "@/lib/mongodb";
const portfolioCollectionName = 'portfolios';

export async function saveUserToMongoDB(user) {
    try {
        const client = await clientPromise;
        const db = client.db();
        
        const users = db.collection('users');
        const portfolios = db.collection(portfolioCollectionName);
        const now = new Date();
        
        // Save or update the user
        const existingUser = await users.findOne({ email: user.email });
        if (!existingUser) {
            await users.insertOne({
                email: user.email,
                displayName: user.displayName,
                username: user.email.split('@')[0].replace(/\.|\W/g, '').toLowerCase(),
                photoURL: user.photoURL,
                role: "user",
                createdAt: now,
                lastLoggedInAt: now,
            });
            console.log('User saved to MongoDB');
        } else {
            await users.updateOne(
                { email: user.email },
                { $set: { lastLoggedInAt: now } }
            );
            console.log('User already exists in MongoDB, lastLoggedInAt updated');
        }
        
        // Ensure the portfolio exists:
        const existingPortfolio = await portfolios.findOne({ email: user.email });
        if (!existingPortfolio) {
            const newPortfolio = {
                email: user.email,
                title: '',
                bio: '',
                socialLinks: [],
                experience: [],
                education: [],
                projects: [],
                skills: [],
                contactInfo: {},
                createdAt: now,
                updatedAt: now
            };
            const result = await portfolios.insertOne(newPortfolio);
            console.log(`Portfolio created for email: ${user.email}`, result);
        } else {
            console.log(`Portfolio already exists for email: ${user.email}`);
        }
        
    } catch (error) {
        console.error('Error saving/updating user to MongoDB:', error);
        throw error;
    }
}

export async function getUserFromMongoDB(email) {
    try {
        const client = await clientPromise;
        const db = client.db(); // Get the database reference from the client
        
        const users = db.collection('users');
        const user = await users.findOne({ email: email });
        
        return user;
    } catch (error) {
        console.error('Error getting user from MongoDB:', error);
        throw error;
    }
}

export async function updateUserInMongoDB(email, updateData) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');
        
        const result = await users.updateOne(
            { email: email },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            throw new Error('User not found');
        }
        
        console.log('User updated in MongoDB:', result);
        return result;
    } catch (error) {
        console.error('Error updating user in MongoDB:', error);
        throw error;
    }
}

export async function getAllUsersFromMongoDB() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');
        const allUsers = await users.find({}).toArray();
        return allUsers;
    } catch (error) {
        console.error('Error getting all users from MongoDB:', error);
        throw error;
    }
}

export async function switchUserRole(email) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");
        
        // Retrieve the user document by email
        const user = await users.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        
        // Ensure the document has availableRoles; if not, set a default
        const availableRoles = user.availableRoles || ["admin", "user"];
        
        // Toggle the role between the two available roles
        const newRole = user.role === availableRoles[0] ? availableRoles[1] : availableRoles[0];
        
        // Update the user's role
        const result = await users.updateOne(
            { email },
            { $set: { role: newRole, availableRoles } }
        );
        
        if (result.modifiedCount === 1) {
            console.log(`✅ User role updated for ${email}: ${user.role} -> ${newRole}`);
            return { role: newRole }; // ✅ Return the updated role
        } else {
            throw new Error("Failed to update role.");
        }
    } catch (error) {
        console.error("❌ Error switching user role in MongoDB:", error);
        throw error;
    }
}


