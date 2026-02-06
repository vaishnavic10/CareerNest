// components/AdminRoute.js
"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext.js";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
    const router = useRouter();
    const { user, role, loading } = useAuth();
    
    useEffect(() => {
        if (!loading) {
            if (!user || role !== "admin") {
                router.push(user ? "/my-account" : "/login");
            }
        }
    }, [user, role, loading, router]);
    
    if (loading || !user || role !== "admin") {
        return (
            <div className="flex items-center justify-center w-full h-full bg-background">
                <p className="text-xl text-foreground">Loading...</p>
            </div>
        );
    }
    
    return <>{children}</>;
}