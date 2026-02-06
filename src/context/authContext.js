"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react"; // Import useCallback
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { auth as firebaseAuth } from "@/lib/firebase";
import Loader from "@/components/Loader";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [token, setToken] = useState(null);
    
    const fetchUserData = useCallback(async (firebaseUser, idToken) => {
        if (firebaseUser && idToken) {
            try {
                const { data } = await axios.get(`/api/user?email=${firebaseUser.email}`, { // Correct endpoint
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });
                setUser(firebaseUser);
                setRole(data.role);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    firebaseAuth.signOut();
                    setUser(null);
                    setRole(null);
                    setToken(null);
                    router.push('/login');
                } else if (error.response && error.response.status === 401) {
                    firebaseAuth.signOut();
                    setUser(null);
                    setRole(null);
                    setToken(null);
                    router.push('/login'); // Redirect to login
                } else {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                    setRole(null);
                    setToken(null);
                }
            }
        } else {
            setUser(null);
            setRole(null);
            setToken(null);
        }
    }, [router]);
    
    const updateRole = useCallback((newRole) => {
        setRole(newRole);
    }, []);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                try {
                    const idToken = await firebaseUser.getIdToken(); // Get the token
                    setToken(idToken); // Set token state
                    await fetchUserData(firebaseUser, idToken);
                } catch (error) {
                    console.error("Error getting Firebase ID token:", error);
                    setUser(null);
                    setRole(null);
                    setToken(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setUser(null);
                setRole(null);
                setToken(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router, fetchUserData]);
    
    if (!mounted) return null;
    
    return (
        <AuthContext.Provider value={{ user, role, loading, token, updateRole }}>
            {loading ? <Loader /> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}