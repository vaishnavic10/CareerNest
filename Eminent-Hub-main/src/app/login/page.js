'use client';

import Link from "next/link";
import SignIn from "@/components/SignIn";
import useTabTitle from "@/hooks/useTabTitle.js"; // Import the SignIn component

export default function Login() {
    useTabTitle('Login');
    return (
        <div className="flex items-center justify-center bg-background mt-44 p-4 sm:p-6 lg:p-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-senary rounded-xl shadow-md sm:px-10 lg:px-16">
                <div>
                    <h2 className="mt-6 text-center text-2xl font-extrabold text-foreground sm:text-3xl lg:text-3xl">
                        Sign in with Google
                    </h2>
                </div>
                <div className="mt-8">
                    <SignIn /> {/* Use the SignIn component here */}
                </div>
                <div className="text-sm text-center sm:text-base lg:text-lg">
                    <Link
                        href="/"
                        className="font-medium text-accent hover:text-indigo-500"
                    >
                        Go back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
