"use client";

import Navbar from "@/components/Navbar.js";

export default function DashboardLayout({ children }) {
    return (
        <div className=" flex flex-col">
            {/* Top Navbar */}
            <Navbar />
            {/* Main content area: scrollable */}
            <main className="flex-1 overflow-y-auto bg-background text-foreground no-scrollbar">
                {children}
            </main>
        </div>
    );
}
