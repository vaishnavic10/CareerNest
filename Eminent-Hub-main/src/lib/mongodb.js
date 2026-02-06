import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI || !process.env.MONGODB_PASSWORD) {
    throw new Error('Please add both MONGODB_URI and MONGODB_PASSWORD to .env.local');
}

// Directly insert the MONGODB_PASSWORD into the MONGODB_URI
const uri = process.env.MONGODB_URI.replace('<db_password>', process.env.MONGODB_PASSWORD); // Change <PASSWORD> to <db_password> to match the URI

const options = {};
const maxRetries = 5;
const retryDelay = 5000; // 5 seconds

let client;
let clientPromise;

const connectWithRetry = async () => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            client = new MongoClient(uri, options);
            await client.connect();
            console.log('MongoDB is connected');
            return client;
        } catch (err) {
            retries++;
            console.log(`MongoDB connection unsuccessful, retry ${retries}/${maxRetries} after ${retryDelay / 1000} seconds.`, err);
            if (retries === maxRetries) {
                throw new Error('Max retries reached. Could not connect to MongoDB.');
            }
            await new Promise(res => setTimeout(res, retryDelay));
        }
    }
};

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = connectWithRetry();
    }
    clientPromise = global._mongoClientPromise;
} else {
    clientPromise = connectWithRetry();
}

export default clientPromise;