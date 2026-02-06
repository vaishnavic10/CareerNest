"use client";

import Link from "next/link";
import React, {useState, useEffect, useRef, useMemo} from "react";
import { useAuth } from "@/context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import {
    RiHeartLine,
    RiHomeLine,
    RiSearchLine,
    RiUserLine,
    RiMenu2Fill,
    RiCloseLine,
} from "react-icons/ri";
import Image from "next/image";
import { useTheme } from "@/context/themeContext";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import useUserOperations from "@/hooks/useUserOperations";
import SearchBox from "@/components/navbar/SearchBox";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import useClickOutside from "@/hooks/useClickOutside";

export default function Navbar() {
    const { user: loggedInUser, role } = useAuth();
    const { username: loggedInUsername, userData } = useUserOperations();
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("");
    const [imgError, setImgError] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
    const { theme, toggleTheme } = useTheme();
    const themes = useMemo(() => ["white", "gray", "dark-blue", "dark-purple", "black-dark"], []);
    const themeColors = useMemo(() => ({
        white: "#ffffff",
        gray: "#161718",
        "dark-blue": "#030712",
        "dark-purple": "#08021a",
        "black-dark": "#000000",
    }), []);
    
    // For random accent color (if needed)
    const [randomColor, setRandomColor] = useState("");
    useEffect(() => {
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        setRandomColor(themeColors[randomTheme].replace("'", "&apos;"));
    }, [themeColors, themes]);
    
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };
    
    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };
    
    const toggleAdminSidebar = () => {
        setAdminSidebarOpen((prev) => !prev);
    };
    
    const toggleMobileSearch = () => {
        setIsMobileSearchOpen((prev) => !prev);
    };
    
    // Close dropdowns when clicking outside
    useClickOutside(dropdownRef, () => setDropdownOpen(false));
    useClickOutside(mobileSearchRef, () => setIsMobileSearchOpen(false));
    
    useEffect(() => {
        const pathSegments = pathname.split("/");
        setActiveTab(pathSegments[2] || "");
    }, [pathname]);
    
    const handleNavigate = (content) => {
        router.push(`/admin/${content}`);
        setAdminSidebarOpen(false);
    };
    
    const handleSearchResultClick = () => {
        setIsMobileSearchOpen(false);
    };
    
    return (
        <>
            <nav className="text-foreground bg-background/85 backdrop-blur-3xl px-4 py-4 fixed top-0 w-full z-40 border-b border-border rounded-b-lg">
                <div className="container mx-auto flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {role === "admin" && (
                            <button onClick={toggleAdminSidebar} className="md:hidden">
                                <RiMenu2Fill size={26} className="cursor-pointer" />
                            </button>
                        )}
                        <Link href="/">
                            <Image src="/logos.png" alt="Eminent Hub" width={40} height={40} />
                        </Link>
                    </div>
                    <div className=" w-2/6 justify-center my-3 md:my-0 relative">
                        <SearchBox isMobile={false} onResultClick={handleSearchResultClick} />
                        <div className="md:hidden flex items-center">
                            {!isMobileSearchOpen ? (
                                <RiSearchLine size={24} className="text-foreground cursor-pointer" onClick={toggleMobileSearch} />
                            ) : (
                                <RiCloseLine size={24} className="text-foreground cursor-pointer" onClick={toggleMobileSearch} />
                            )}
                        </div>
                    </div>
                    {isMobileSearchOpen && (
                        <div ref={mobileSearchRef} className="md:hidden absolute top-full left-0 w-full rounded-b-lg z-30 p-4">
                            <SearchBox isMobile={true} onResultClick={handleSearchResultClick} />
                        </div>
                    )}
                    <div className="flex items-center space-x-4 relative">
                        <div ref={dropdownRef}>
                            <button onClick={toggleDropdown} className="focus:outline-none flex items-center">
                                {userData && userData?.photoURL && !imgError ? (
                                    <Image
                                        src={userData.photoURL}
                                        alt="Profile"
                                        className="w-11 h-11 rounded-full object-cover cursor-pointer"
                                        onError={() => setImgError(true)}
                                        width={44}
                                        height={44}
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-full border border-border bg-background text-foreground flex items-center justify-center font-bold text-sm cursor-pointer">
                                        {loggedInUser?.displayName
                                            ? loggedInUser.displayName.slice(0, 2).toUpperCase()
                                            : <Image
                                                src="/avatar.png"
                                                alt="Default Avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                                width={40}
                                                height={40}
                                            />}
                                    </div>
                                )}
                            </button>
                            {dropdownOpen && (
                                <ProfileDropdown
                                    loggedInUser={loggedInUser}
                                    loggedInUsername={loggedInUsername}
                                    userData={userData}
                                    imgError={imgError}
                                    setImgError={setImgError}
                                    handleSignOut={handleSignOut}
                                    toggleTheme={toggleTheme}
                                    theme={theme}
                                    themes={themes}
                                    themeColors={themeColors}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {adminSidebarOpen && role === "admin" && (
                <div className="md:hidden fixed inset-0 z-50 flex" onClick={toggleAdminSidebar}>
                    <div className="relative z-50 w-64 mt-20" onClick={(e) => e.stopPropagation()}>
                        <AdminSidebar onNavigate={handleNavigate} activeTab={activeTab} />
                    </div>
                </div>
            )}
        </>
    );
}
