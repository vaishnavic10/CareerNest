"use client";

import AdminRoute from "@/components/dashboard/AdminRoute.js";
import DashboardLayout from "@/components/dashboard/DashboardLayout.js";
import AdminSidebar from "@/components/dashboard/AdminSidebar.js";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("");
    
    useEffect(() => {
        const pathSegments = pathname.split('/');
        setActiveTab(pathSegments[2] || "");
    }, [pathname]);
    
    const handleNavigate = (content) => {
        router.push(`/admin/${content}`);
    };
    
    return (
        <AdminRoute>
            <DashboardLayout>
                <div className="flex h-full w-full">
                    <div className="hidden md:block">
                        <AdminSidebar onNavigate={handleNavigate} activeTab={activeTab} />
                    </div>
                    <div className="no-scrollbar mt-7 overflow-y-auto p-4 flex-1 h-screen">
                        {children}
                    </div>
                </div>
            </DashboardLayout>
        </AdminRoute>
    );
}
