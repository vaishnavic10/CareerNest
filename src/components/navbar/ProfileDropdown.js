"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    RiHomeLine,
    RiUserLine,
    RiHeartLine,
    RiSearchLine,
    RiArrowLeftRightLine,
} from "react-icons/ri";
import { LuExternalLink } from "react-icons/lu";
import useUserOperations from "@/hooks/useUserOperations";
import { useRouter } from "next/navigation";
import useClickOutside from "@/hooks/useClickOutside";
import {ROLE_NAVIGATION_MAP} from "@/utils/roleNavigation.js";
import {PiUserSwitchDuotone} from "react-icons/pi";
import {BiNavigation} from "react-icons/bi";
import {TbSmartHome} from "react-icons/tb";

export default function ProfileDropdown({
                                            loggedInUser,
                                            loggedInUsername,
                                            userData,
                                            imgError,
                                            setImgError,
                                            handleSignOut,
                                            toggleTheme,
                                            theme,
                                            themes,
                                            themeColors,
                                            onRoleSwitch, // Optional: Callback for role switch
                                            onClose, // Optional: Callback to close dropdown when clicking outside
                                        }) {
    const { switchUserRole } = useUserOperations();
    const router = useRouter();
    const [otherRoles, setOtherRoles] = useState([]);
    const [loading, setLoading] = useState(false); // State to manage loading status
    const dropdownRef = useRef(null);
    
    // Close dropdown when clicking outside
    useClickOutside(dropdownRef, () => {
        if (onClose) {
            onClose();
        }
    });
    
    useEffect(() => {
        if (userData?.availableRoles && userData.role) {
            const roles = userData.availableRoles.filter(
                (role) => role !== userData.role
            );
            setOtherRoles(roles);
        }
    }, [userData]);
    
    const handleSwitchRoleClick = async () => {
        if (userData?.email && otherRoles.length === 1) {
            setLoading(true);
            const response = await switchUserRole(userData.email);
            setLoading(false);
            
            if (response?.result?.role) {
                const newRole = response.result.role;
                // Redirect based on the new role using ROLE_NAVIGATION_MAP
                if (ROLE_NAVIGATION_MAP[newRole]) {
                    router.push(ROLE_NAVIGATION_MAP[newRole]);
                } else {
                    router.refresh(); // Fallback
                }
                if (onRoleSwitch) {
                    onRoleSwitch();
                }
            } else {
                console.error(
                    "Failed to switch role or no role returned:",
                    response?.error
                );
            }
        } else {
            // Navigate to the dashboard based on the current role
            router.push(ROLE_NAVIGATION_MAP[userData.role] || "/");
        }
    };
    
    return (
        <div ref={dropdownRef} className="relative z-10">
            <div
                className="absolute right-0 mt-2 w-64 backdrop-blur-3xl bg-senary/99 text-foreground border-border border rounded-xl p-1 shadow-md z-20">
                {/* Login/Profile Block */}
                <div className="p-1 border-b border-border">
                    <Link href={loggedInUser ? `/${loggedInUsername}` : "/login"}>
                        <div
                            className="flex p-2 items-center space-x-2 hover:bg-secondary hover:text-background rounded-md">
                            {userData && userData?.photoURL && !imgError ? (
                                <Image
                                    src={userData.photoURL}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover"
                                    onError={() => setImgError(true)}
                                    width={40}
                                    height={40}
                                />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full border border-border bg-background text-foreground flex items-center justify-center font-bold">
                                    {loggedInUser?.displayName
                                        ? loggedInUser.displayName
                                            .slice(0, 2)
                                            .toUpperCase()
                                        : <Image
                                            src="/avatar.png"
                                            alt="Default Avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                            width={40}
                                            height={40}
                                        />}
                                </div>
                            )}
                            <div>
                                {loggedInUser ? (
                                    <>
                                        <p className="font-semibold text-sm">
                                            {loggedInUser.displayName}
                                        </p>
                                        <p className="text-xs text-[var(--muted)]">
                                            @{loggedInUsername}
                                        </p>
                                    </>
                                ) : (
                                    <p className="font-semibold text-sm">Login</p>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
                {/* Navigation Links */}
                <nav className="p-1 text-sm">
                    <ul>
                        <li>
                            <Link
                                href="/"
                                className="px-4 py-2 hover:bg-secondary hover:text-background rounded-t-md flex items-center space-x-2"
                            >
                                <TbSmartHome className="w-5 h-5"/>
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/my-account/profile"
                                className="block px-4 py-2 hover:bg-secondary hover:text-background rounded-md flex items-center space-x-2"
                            >
                                <RiUserLine className="w-5 h-5"/>
                                <span>Profile</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/activity"
                                className="block px-4 py-2 hover:bg-secondary hover:text-background rounded-md flex items-center space-x-2"
                            >
                                <RiHeartLine className="w-5 h-5"/>
                                <span>Activity</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/explore"
                                className="block px-4 py-2 hover:bg-secondary hover:text-background rounded-b-md flex items-center space-x-2"
                            >
                                <RiSearchLine className="w-5 h-5"/>
                                <span>Explore</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <hr className="border-t border-border my-1"/>
                <nav className="px-1 text-sm">
                    <ul>
                        <li className="hover:bg-secondary hover:text-background rounded-md">
                            <Link
                                // Use ROLE_NAVIGATION_MAP for dashboard navigation
                                href={
                                    loggedInUser
                                        ? ROLE_NAVIGATION_MAP[userData?.role] || "/"
                                        : "/login"
                                }
                                className="flex justify-between items-center px-4 py-2"
                            >
                                Dashboard
                                <BiNavigation className="w-5 h-5"/>
                            </Link>
                        </li>
                    </ul>
                </nav>
                {userData?.availableRoles &&
                    userData.availableRoles.length > 1 && (
                        <>
                            <hr className="border-t border-border my-1"/>
                            <nav className="px-1 text-sm">
                                <ul>
                                    <li className="hover:bg-secondary hover:text-background rounded-md">
                                        <button
                                            onClick={handleSwitchRoleClick}
                                            className="w-full text-left flex justify-between items-center px-4 py-2"
                                        >
                                            <span>
                                                Switch Role:{" "}
                                                {userData?.role &&
                                                userData.availableRoles.includes(
                                                    userData.role === "user" ? "admin" : "user"
                                                )
                                                    ? userData.role === "user"
                                                        ? "Admin"
                                                        : "User"
                                                    : "Loading..."}
                                            </span>
                                            <PiUserSwitchDuotone className="w-5 h-5"/>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                <hr className="border-t border-border my-1"/>
                <nav className="p-1 text-sm">
                    <ul>
                        <li>
                            <Link
                                href="/settings"
                                className="block px-4 py-2 hover:bg-secondary rounded-t-md hover:text-background"
                            >
                                Settings
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/support"
                                className="block px-4 py-2 hover:bg-secondary rounded-md hover:text-background"
                            >
                                Support
                            </Link>
                        </li>
                        {loggedInUser && (
                            <li>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left block px-4 py-2 hover:bg-danger hover:text-background rounded-b-md"
                                >
                                    Sign Out
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
                <hr className="border-t border-border"/>
                
                <div className="px-2 pb-2 text-sm">
                    <h3 className="px-4 py-2 text-sm font-semibold">Themes</h3>
                    <div className="flex gap-3 px-4">
                        {themes.map((option) => (
                            <button
                                key={option}
                                onClick={() => toggleTheme(option)}
                                className={`w-7 h-7 rounded-full focus:ring focus:outline-none transition-colors duration-300 ${
                                    theme === option ? "border-2 border-accent" : ""
                                }`}
                                style={{backgroundColor: themeColors[option]}}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
