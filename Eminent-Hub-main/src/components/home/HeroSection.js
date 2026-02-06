"use client";
import Link from "next/link";
import Button from "@/components/Button";

export default function HeroSection() {
    return (
        <section className="py-20 flex flex-col rounded-b-2xl items-center justify-center relative overflow-hidden h-[calc(100vh-15rem)]">
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-90 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 via-green-500 to-lime-500 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-red-500 via-yellow-500 to-orange-500 opacity-95 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
            
            {/* Main content */}
            <div className="container mx-auto px-6 text-center relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg text-white">
                    Build Your Unique Online Presence
                </h1>
                <p className="text-md md:text-lg opacity-75 mb-8 text-white">
                    Create your personal portfolio, share your thoughts through blogs, and connect with others.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/login">
                        <Button variant="gray">
                            Create Your Portfolio
                        </Button>
                    </Link>
                    <Link href="/blogs">
                        <Button variant="gray">
                            Explore Blogs
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
