"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import { FaCode, FaBug, FaLightbulb, FaBook, FaHandsHelping } from "react-icons/fa";
import useTabTitle from "@/hooks/useTabTitle.js"; // Changed icons

export default function Contribute() {
    useTabTitle("Contribute");
    return (
        <>
            <div className="flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-8xl w-full p-10 bg-senary rounded-xl shadow-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Contribute to Our Project</h1>
                        <p className="mt-2 text-foreground">We welcome contributions from the community!</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Restructured grid layout */}
                        {/* Contributing Code */}
                        <div className="bg-background rounded-md shadow-sm p-6 text-center">
                            <FaCode className="inline-block text-3xl text-secondary mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Write Code</h3>
                            <p className="text-foreground mb-4">
                                Contribute new features, fix existing bugs, or improve the codebase. Check out our{" "}
                                <Link href="/github" className="text-secondary hover:underline">
                                    GitHub repository
                                </Link>{" "}
                                for open issues and contribution guidelines.
                            </p>
                            <Link
                                href="/github"
                                className="inline-block bg-secondary hover:bg-secondary-dark text-foreground font-medium py-2 px-4 rounded"
                            >
                                View on GitHub
                            </Link>
                        </div>
                        
                        {/* Reporting Bugs */}
                        <div className="bg-background rounded-md shadow-sm p-6 text-center">
                            <FaBug className="inline-block text-3xl text-danger mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Report Bugs</h3>
                            <p className="text-foreground mb-4">
                                Found an issue? Help us make our platform better by reporting any bugs you encounter.
                            </p>
                            <Link
                                href="/bug-report"
                                className="inline-block bg-danger hover:bg-danger-dark text-foreground font-medium py-2 px-4 rounded"
                            >
                                Report a Bug
                            </Link>
                        </div>
                        
                        {/* Suggesting Features */}
                        <div className="bg-background rounded-md shadow-sm p-6 text-center">
                            <FaLightbulb className="inline-block text-3xl text-accent mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Suggest Features</h3>
                            <p className="text-foreground mb-4">
                                Have a great idea for a new feature or improvement? Share your suggestions with us!
                            </p>
                            <Link
                                href="/feature-requests" // Replace with your actual feature request mechanism
                                className="inline-block bg-accent hover:bg-accent-dark text-foreground font-medium py-2 px-4 rounded"
                            >
                                Suggest a Feature
                            </Link>
                        </div>
                        
                        {/* Improving Documentation */}
                        <div className="bg-background rounded-md shadow-sm p-6 text-center">
                            <FaBook className="inline-block text-3xl text-primary mb-4" /> {/* Changed icon */}
                            <h3 className="text-xl font-semibold text-foreground mb-2">Improve Docs</h3>
                            <p className="text-foreground mb-4">
                                Help others by improving our documentation, tutorials, or guides.
                            </p>
                            <Link
                                href="/docs/contributing" // Replace with your documentation contribution guidelines
                                className="inline-block bg-primary hover:bg-primary-dark text-foreground font-medium py-2 px-4 rounded"
                            >
                                Contribute to Docs
                            </Link>
                        </div>
                        
                        {/* Other Ways to Contribute */}
                        <div className="bg-background rounded-md shadow-sm p-6 text-center">
                            <FaHandsHelping className="inline-block text-3xl text-tertiary mb-4" /> {/* Added icon */}
                            <h3 className="text-xl font-semibold text-foreground mb-2">Other Ways</h3>
                            <p className="text-foreground mb-4">
                                You can also contribute by providing feedback, testing new releases, or spreading the word about our project.
                            </p>
                            {/* You can add specific links or information here */}
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-secondary hover:text-indigo-500 font-medium"
                        >
                            Go back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}