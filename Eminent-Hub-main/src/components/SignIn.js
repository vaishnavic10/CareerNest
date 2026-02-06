 "use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { ROLE_NAVIGATION_MAP } from "@/utils/roleNavigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function SignIn() {
    const router = useRouter();
    const { user, role, loading } = useAuth();
    const [localLoading, setLocalLoading] = useState(false);
    
    useEffect(() => {
        if (!loading && user) {
            const redirectPath = ROLE_NAVIGATION_MAP[role] || "/my-account";
            router.push(redirectPath);
        }
    }, [user, role, loading, router]);
    
    const handleGoogleSignIn = async () => {
        setLocalLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            await axios.post("/api/auth", firebaseUser);
            setLocalLoading(false);
        } catch (error) {
            console.error("Google Signin Error:", error);
            setLocalLoading(false);
        }
    };
    
    return (
        <div className="flex justify-center items-center ">
            <button
                onClick={handleGoogleSignIn}
                className="group relative w-full flex justify-center items-center py-3 px-6 border border-border rounded-lg text-base font-medium text-[var(--foreground)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                
            >
                {localLoading ? (
                    <span>Signing in...</span>
                ) : (
                    <>
                        <Image
                            src="https://cdn-icons-png.flaticon.com/128/300/300221.png"
                            alt="Google Logo"
                            width={24}
                            height={24}
                            className="mr-2"
                        />
                        <span>Sign in with Google</span>
                    </>
                )}
            </button>
        </div>
    );
}