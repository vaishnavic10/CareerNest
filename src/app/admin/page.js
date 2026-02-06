"use client";

import { useUsers } from "@/hooks/useUsers.js";
import useTabTitle from "@/hooks/useTabTitle.js"; // adjust the path as needed

export default function DashboardPage() {
    useTabTitle("Admin Dashboard");
    const { loading, error, roleCounts } = useUsers({
        searchTerm: "",
        filterDate: "",
        customStartDate: "",
        customEndDate: "",
    });
    
    return (
        <div className="mt-6 h-full p-6 bg-background rounded-lg shadow-md flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold text-foreground">
                Welcome, Admin!
            </h2>
            <p className="text-foreground">
                This is the admin view of the dashboard.
            </p>
            
            {loading ? (
                <p className="text-foreground mt-4">Loading user data...</p>
            ) : error ? (
                <p className="text-danger mt-4">{error}</p>
            ) : (
                <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {roleCounts.user ? (
                            <div
                                className="p-4 bg-background border border-border rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <h4 className="text-lg font-semibold text-foreground">
                                    Total Users
                                </h4>
                                <p className="text-foreground mt-2">
                                    Total: {roleCounts.user}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
