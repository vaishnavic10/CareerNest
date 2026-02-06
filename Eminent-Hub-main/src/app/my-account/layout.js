"use client";

import UserRoute from "@/components/dashboard/UserRoute.js";
import DashboardLayout from "@/components/dashboard/DashboardLayout.js";
import UserSidebar from "@/components/dashboard/UserSidebar.js";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("");
    
    useEffect(() => {
        const pathSegments = pathname.split('/');
        setActiveTab(pathSegments[2] || "");
    }, [pathname]);
    
    const handleNavigate = (content) => {
        router.push(`/my-account/${content}`);
    };
    
    return (
        <UserRoute>
            <DashboardLayout>
                <div className="flex h-full w-full">
                    <UserSidebar onNavigate={handleNavigate} activeTab={activeTab} />
                    <div className="flex-1 w-full  h-screen no-scrollbar overflow-y-auto p-4 md:ml-20">
                        {children}
                    </div>
                </div>
            </DashboardLayout>
        </UserRoute>
    );
}