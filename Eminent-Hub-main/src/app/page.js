'use client';

import DashboardLayout from "@/components/dashboard/DashboardLayout.js";
import Header from "@/components/HomePage.js";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function Home() {
    useTabTitle("Home");
    return (
        <DashboardLayout>
            <Header />
        </DashboardLayout>
    );
}
