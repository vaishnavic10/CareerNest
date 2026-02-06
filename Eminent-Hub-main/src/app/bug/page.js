"use client";

import Footer from "@/components/Footer";
import InputBox from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useState } from "react";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function BugReport() {
    useTabTitle("Report a Bug");
    const [formData, setFormData] = useState({
        summary: "",
        description: "",
        stepsToReproduce: "",
        expectedResult: "",
        actualResult: "",
        browser: "",
        os: "",
        severity: "minor", // Default value
    });
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus(null); // Reset status
        
        // In a real application, you would send this data to your backend
        console.log("Bug Report Data:", formData);
        
        // Simulate a successful submission for demonstration
        setTimeout(() => {
            setFormData({ // Clear the form
                summary: "",
                description: "",
                stepsToReproduce: "",
                expectedResult: "",
                actualResult: "",
                browser: "",
                os: "",
                severity: "minor",
            });
            setSubmissionStatus('success');
        }, 1000);
        
        // Or simulate an error
        // setTimeout(() => {
        //     setSubmissionStatus('error');
        // }, 1500);
    };
    
    return (
        <>
            <div className="flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full p-10 bg-senary rounded-xl shadow-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Report a Bug</h1>
                        <p className="mt-2 text-foreground">Help us improve by reporting any issues you encounter.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputBox
                            label="Brief Summary"
                            type="text"
                            name="summary"
                            placeholder="A short description of the bug"
                            value={formData.summary}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            label="Detailed Description"
                            name="description"
                            placeholder="Provide a more detailed explanation of the bug"
                            value={formData.description}
                            onChange={handleChange}
                            textarea
                            rows={4}
                            required
                        />
                        <InputBox
                            label="Steps to Reproduce"
                            name="stepsToReproduce"
                            placeholder="How can we reproduce this bug? Please be specific."
                            value={formData.stepsToReproduce}
                            onChange={handleChange}
                            textarea
                            rows={4}
                            required
                        />
                        <InputBox
                            label="Expected Result"
                            name="expectedResult"
                            placeholder="What did you expect to happen?"
                            value={formData.expectedResult}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            label="Actual Result"
                            name="actualResult"
                            placeholder="What actually happened?"
                            value={formData.actualResult}
                            onChange={handleChange}
                            required
                        />
                        <InputBox
                            label="Browser"
                            type="text"
                            name="browser"
                            placeholder="Your browser (e.g., Chrome, Firefox, Safari)"
                            value={formData.browser}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Operating System"
                            type="text"
                            name="os"
                            placeholder="Your operating system (e.g., Windows, macOS, Linux)"
                            value={formData.os}
                            onChange={handleChange}
                        />
                        <div>
                            <label htmlFor="severity" className="block text-foreground text-sm font-bold mb-2">
                                Severity
                            </label>
                            <select
                                id="severity"
                                name="severity"
                                value={formData.severity}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-senary"
                            >
                                <option value="minor">Minor</option>
                                <option value="major">Major</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        
                        <Button type="submit" variant="danger">
                            Submit Bug Report
                        </Button>
                        
                        {submissionStatus === 'success' && (
                            <div className="mt-4 text-green-500">
                                Thank you for your report! We will investigate this issue.
                            </div>
                        )}
                        {submissionStatus === 'error' && (
                            <div className="mt-4 text-red-500">
                                An error occurred while submitting your report. Please try again later.
                            </div>
                        )}
                    </form>
                    
                    <div className="mt-8 text-center">
                        <Link
                            href="/help-center"
                            className="text-secondary hover:text-indigo-500 font-medium mr-4"
                        >
                            Go back to Help Center
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