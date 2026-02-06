"use client";
import Link from "next/link";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import RecentBlogsSection from "@/components/home/RecentBlogsSection.js";

export default function HomePage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <HeroSection />
            
            <RecentBlogsSection />
            
            {/* Testimonials Section */}
            <TestimonialsSection />
            
            {/* FAQ Section */}
            <FaqSection />
            
            {/* Call to Action Section */}
            <section className="py-20 mx-6 md:mx-52 mb-12 rounded-2xl bg-gradient-to-tl from-blue-500 to-purple-500 opacity-75">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-8 text-white">
                        Ready to Showcase Your Talent?
                    </h2>
                    <p className="md:text-xl text-md text-white opacity-80 mb-10">
                        Join our community of creators and build your professional online presence today!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/login">
                            <Button variant="gray" className="px-6 py-3 transition duration-300">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}
