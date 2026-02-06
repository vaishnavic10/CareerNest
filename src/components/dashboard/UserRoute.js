// components/UserRoute.js
"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext.js";
import { useEffect } from "react";

export default function UserRoute({ children }) {
    const router = useRouter();
    const { user, role, loading } = useAuth();
    
    useEffect(() => {
        if (!loading) {
            if (!user || role !== "user") {
                router.push(user ? "/admin" : "/login");
            }
        }
    }, [user, role, loading, router]);
    
    if (loading || !user || role !== "user") {
        return <div>Loading...</div>;
    }
    
    return <>{children}</>;
}