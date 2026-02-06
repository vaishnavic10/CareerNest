// src/lib/firebaseAdmin.js
import admin from 'firebase-admin';

let firebaseAdmin;

if (!admin.apps.length) {
    try {
        const serviceAccountKey = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;
        
        if (!serviceAccountKey) {
            throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY is not set in environment variables.');
        }
        
        const serviceAccount = JSON.parse(serviceAccountKey);
        
        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error('Firebase Admin Initialization Error', error);
    }
} else {
    firebaseAdmin = admin.app();
}

export default firebaseAdmin;