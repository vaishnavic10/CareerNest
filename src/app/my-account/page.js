"use client";

import {useAuth} from "@/context/authContext.js";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function DashboardPage() {
    useTabTitle("User Dashboard");
    const { user } = useAuth();
    
    return (
        <div className="container mx-auto p-6 bg-background rounded-lg border border-border flex-1">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
                Welcome, {user.displayName || 'User'}!
            </h2>
            <p className="text-[var(--foreground)]">
                This is the User view of the dashboard.
            </p>
        </div>
    );
}