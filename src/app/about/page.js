"use client";
import Link from "next/link";
import Footer from "@/components/Footer";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function About() {
    useTabTitle("About Us"); // Set the tab title
    
    return (
        <>
            <div className=" flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full p-10 bg-senary rounded-xl shadow-md text-center">
                    <h1 className="text-4xl font-bold text-foreground">About Us</h1>
                    <p className="mt-4 text-foreground text-lg">
                        Welcome to Eminent Hub! We are a platform dedicated to empowering professionals like you to build a strong online presence.
                    </p>
                    <p className="mt-2 text-foreground">
                        Our mission is to simplify and enhance digital experiences for professionals by providing modern tools to showcase their skills, share their expertise, and connect with a wider audience.
                    </p>
               <p className="mt-6 text-foreground">
                   At Eminent Hub, we understand the importance of a professional online identity in today&apos;s digital world. Whether you&apos;re a seasoned expert or just starting your career, we provide the resources you need to shine.
               </p>
                    <p className="mt-4 text-foreground">
                        Our platform enables you to:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-foreground">
                        <li><strong>Showcase Your Skills:</strong> Highlight your expertise and talents with visually appealing profiles.</li>
                        <li><strong>Share Your Insights:</strong> Publish blog posts and articles to establish yourself as a thought leader.</li>
                        <li><strong>Build Your Portfolio:</strong> Create a dynamic portfolio to display your projects and accomplishments.</li>
                        <li><strong>Craft Your Resume:</strong> Develop a professional resume that stands out to potential employers.</li>
                    </ul>
                    <p className="mt-4 text-foreground">
                        We are committed to providing a user-friendly and feature-rich environment that helps you achieve your professional goals. Join our community today and take your online presence to the next level!
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/"
                            className="text-secondary hover:text-indigo-500 font-medium"
                        >
                            Go back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer /> {/* Add the Footer component here */}
        </>
    );
}