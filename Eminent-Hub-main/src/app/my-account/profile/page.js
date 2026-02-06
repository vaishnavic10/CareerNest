"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import InputBox from "@/components/Input";
import Button from "@/components/Button";
import  useUserOperations  from "@/hooks/useUserOperations";
import { toast } from "react-hot-toast";
import { FiUser } from "react-icons/fi";
import { IoAt } from "react-icons/io5";
import { TbPhoto } from "react-icons/tb";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function ProfilePage() {
    useTabTitle("Profile");
    const { user } = useAuth();
    const { userData, loading, error, fetchUser, updateUser } = useUserOperations();
    
    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        if (user?.email) {
            fetchUser(user.email);
        }
    }, [user, fetchUser]);
    
    useEffect(() => {
        if (userData) {
            setDisplayName(userData.displayName || "");
            setPhotoURL(userData.photoURL || "");
            setUsername(userData.username || "");
        }
    }, [userData]);
    
    const handleSave = async (e) => {
        e.preventDefault();
        if (!user?.email) return;
        
        const updatedData = { displayName, photoURL, username };
        const success = await updateUser(user.email, updatedData);
        
        if (success) {
            toast.success("Profile updated successfully!");
        } else {
            toast.error("Failed to update profile.");
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-background">
                <p className="text-xl text-foreground">Loading profile...</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }
    
    return (
        <div className="p-4 container mx-auto bg-background text-foreground">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            {userData && (
                <div>
                    <h2 className="text-xl font-semibold">User Information</h2>
                    <p className="text-lg font-medium">
                        Welcome, <span className="font-semibold">{userData.displayName || userData.email}</span>!
                    </p>
                    <div className="flex items-center space-x-2">
                        <IoAt className="w-5 h-5 text-foreground" />
                        <p className="text-sm font-mono">{userData.email}</p>
                    </div>
                </div>
            )}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <InputBox
                        label="Display Name"
                        name="displayName"
                        placeholder="John Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        icon={<FiUser className="w-5 h-5 text-foreground" />}
                    />
                    <InputBox
                        label="Profile Picture URL"
                        name="photoURL"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        required
                        icon={<TbPhoto className="w-5 h-5 text-foreground" />}
                    />
                    <InputBox
                        label="Username"
                        name="username"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        icon={<IoAt className="w-5 h-5 text-foreground" />}
                    />
                    <Button type="submit" variant="success" loading={loading} disabled={loading}>
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
}