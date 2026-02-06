"use client";
import Footer from "@/components/Footer";
import InputBox from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useState } from "react";
import { toast } from 'react-hot-toast';
import useTabTitle from "@/hooks/useTabTitle.js"; // Import toast

export default function FeatureRequest() {
    useTabTitle("Feature Request");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "general",
        priority: "medium",
        email: "", // Added email field
    });
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true
        try {
            const response = await fetch('/api/feature-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setFormData({
                    title: "",
                    description: "",
                    category: "general",
                    priority: "medium",
                    email: "", // Clear email field as well
                });
                toast.success(data.message || "Thank you for your suggestion! We appreciate your input."); // Show success toast
            } else {
                toast.error(data.error || "An unexpected error occurred."); // Show error toast
            }
            
        } catch (error) {
            console.error("Error submitting feature request:", error);
            toast.error("Failed to connect to the server."); // Show error toast
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };
    
    return (
        <>
            <div className="flex flex-col justify-center items-center bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full p-6 sm:p-8 bg-senary rounded-xl shadow-md">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Suggest a Feature</h1>
                        <p className="mt-2 text-foreground text-sm sm:text-base">Share your ideas to help us improve our portfolio platform!</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <InputBox
                            label="Your Email" // Added email input
                            type="email"
                            name="email"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            label="Feature Title"
                            type="text"
                            name="title"
                            placeholder="A concise title for your suggestion"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            label="Detailed Description"
                            name="description"
                            placeholder="Please provide a detailed explanation of your feature request"
                            value={formData.description}
                            onChange={handleChange}
                            textarea
                            rows={4}
                            required
                        />
                        <div>
                            <label htmlFor="category" className="block text-foreground text-sm font-bold mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-senary text-sm"
                            >
                                <option value="general">General</option>
                                <option value="portfolio-display">Portfolio Display</option>
                                <option value="project-management">Project Management</option>
                                <option value="resume-integration">Resume Integration</option>
                                <option value="blogging">Blogging</option>
                                <option value="contact-forms">Contact Forms</option>
                                <option value="customization">Customization</option>
                                <option value="performance">Performance</option>
                                <option value="security">Security</option>
                                {/* Add more relevant categories as needed */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-foreground text-sm font-bold mb-2">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-senary text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        
                        <Button type="submit" variant="success" className="w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit Feature Request"}
                        </Button>
                        
                    </form>
                    
                    <div className="mt-8 text-center text-sm sm:text-base">
                        <Link
                            href="/contribute"
                            className="text-secondary hover:text-indigo-500 font-medium mr-4"
                        >
                            Go back to Contribution Page
                        </Link>
                        <Link
                            href="/"
                            className="text-foreground hover:text-secondary font-medium"
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