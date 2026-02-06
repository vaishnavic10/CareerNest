"use client";

import { useRouter } from "next/navigation";
import { FiLogOut, FiPlus } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.js";
import { RiHomeLine } from "react-icons/ri";
import { MdOutlineEditNote } from "react-icons/md";
import { GrArticle } from "react-icons/gr";
import {TbUserScreen} from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import Modal from "@/components/Modal"; // Ensure this path is correct
import { useState } from "react";
import {LiaUserTieSolid} from "react-icons/lia";

export default function UserSidebar({ onNavigate, activeTab }) {
    const router = useRouter();
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [isPostModalOpen, setPostModalOpen] = useState(false);
    
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };
    
    const navItems = [
        { icon: <div className="p-2"><RiHomeLine size={24} /></div>, content: "" },
        { icon: <div className="p-2"><GrArticle size={24} /></div>, content: "resume" },
        { icon: <div className="p-2"><MdOutlineEditNote size={24} /></div>, content: "blog" },
        { icon: <div className="p-2"><TbUserScreen size={24} /></div>, content: "portfolio" },
        { icon: <div className="p-2"><LiaUserTieSolid size={24} /></div>, content: "jobs" },
        { icon: <div className="p-2"><IoSearch size={24} /></div>, content: "search" },
        { icon: <div className="p-3 bg-secondary text-foreground rounded-md"><FiPlus size={24} /></div>, content: "post" },
    ];
    
    const handleItemClick = (content) => {
        if (content === "search") {
            setSearchModalOpen(true);
        } else if (content === "post") {
            setPostModalOpen(true);
        } else {
            onNavigate(content);
        }
    };
    
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden fixed md:flex w-20 h-[calc(100vh-4rem)] bg-background rounded-r-lg text-foreground p-4 flex-col items-center justify-between border-r border-border">
                <div className="flex-grow" />
                <h2 className="text-xl font-semibold mb-4 sr-only">User Menu</h2>
                <nav className="space-y-8 flex flex-col items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.content}
                            onClick={() => handleItemClick(item.content)}
                            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                                activeTab === item.content
                                    ? "bg-secondary text-background font-semibold"
                                    : "hover:bg-secondary hover:text-background"
                            }`}
                            title={item.content.charAt(0).toUpperCase() + item.content.slice(1)}
                        >
                            {item.icon}
                        </button>
                    ))}
                </nav>
                <div className="flex-grow" />
                <button
                    onClick={handleSignOut}
                    className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors hover:bg-danger hover:text-background ${
                        activeTab === "logout" ? "bg-danger text-background font-semibold" : ""
                    }`}
                    title="Sign Out"
                >
                    <div className="p-2 mb-10"><FiLogOut size={24} /></div>
                </button>
            </aside>
            
            {/* Mobile Bottom Navigation */}
            <nav className="flex md:hidden fixed bottom-0 left-0 w-full h-16 bg-background text-foreground border-t rounded-t-lg border-border">
                <div className="flex flex-grow justify-around items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.content}
                            onClick={() => handleItemClick(item.content)}
                            className={`flex flex-col items-center justify-center transition-colors ${
                                activeTab === item.content ? "text-secondary" : "hover:text-secondary"
                            }`}
                            title={item.content.charAt(0).toUpperCase() + item.content.slice(1)}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>
            </nav>
            
            {/* Search Coming Soon Modal */}
            <Modal
                isOpen={isSearchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                title="Coming Soon"
            >
                <div className="p-4">
                    <p className="mb-4">The search functionality is coming soon. Stay tuned!</p>
                    <button
                        onClick={() => setSearchModalOpen(false)}
                        className="bg-primary text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            </Modal>
            
            {/* Post Coming Soon Modal */}
            <Modal
                isOpen={isPostModalOpen}
                onClose={() => setPostModalOpen(false)}
                title="Coming Soon"
            >
                <div className="p-4">
                    <p className="mb-4">The post functionality is coming soon. Stay tuned!</p>
                    <button
                        onClick={() => setPostModalOpen(false)}
                        className="bg-primary text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
}
