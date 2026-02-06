"use client";

import { useRouter } from "next/navigation";
import {FiHome, FiUsers, FiSettings, FiLogOut, FiGitPullRequest} from "react-icons/fi";
import { MdOutlineCommentBank } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.js";
import {GrArticle, GrContactInfo} from "react-icons/gr";
import { RxRocket } from "react-icons/rx";
import {CgWebsite} from "react-icons/cg";
import {TbLogs} from "react-icons/tb";

export default function AdminSidebar({ onNavigate, activeTab }) {
    const router = useRouter();
    
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };
    
    const navItems = [
        { label: "Dashboard", icon: <FiHome size={19} />, content: "" },
        { label: "Users", icon: <FiUsers size={19}/>, content: "users" },
        { label: "Articles", icon: <GrArticle size={19}/>, content: "articles" },
        // { label: "Projects", icon: <RxRocket />, content: "projects" },
        { label: "Testimonials", icon: <TbLogs size={19}/>, content: "testimonials" },
        { label: "Contact Messages", icon: <GrContactInfo size={19}/>, content: "contact-messages" },
        { label: "Website Updates", icon: <CgWebsite size={19}/>, content: "website-updates" },
        { label: "Feature Requests", icon: <FiGitPullRequest size={19}/>, content: "feature-requests" },
        // { label: "Settings", icon: <FiSettings size={19}/>, content: "settings" },
    ];
    
    return (
        <aside className="w-64 h-full bg-senary/80 backdrop-blur-3xl text-foreground border-border border-r rounded-r-xl shadow-md p-4 flex flex-col">
            {/*<h2 className="text-2xl font-semibold mb-4 mt-2">Admin Panel </h2>*/}
            
            <div className=" justify-between flex flex-col h-full">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.content}
                            onClick={() => onNavigate(item.content)}
                            className={`w-full flex items-center space-x-2 p-2 rounded-md transition-colors ${
                                activeTab === item.content
                                    ? "bg-secondary text-background font-semibold"
                                    : "hover:bg-secondary hover:text-background"
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                {/*<div className="flex-grow"></div>*/}
                <button
                    onClick={handleSignOut}
                    className={`flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-danger hover:text-background ${
                        activeTab === "logout" ? "bg-danger text-background font-semibold" : ""
                    }`}
                >
                    <FiLogOut/>
                    <span>Sign Out</span>
                </button>
            </div>
        
        
        </aside>
    );
}
