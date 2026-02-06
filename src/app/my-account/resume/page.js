"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink, PDFViewer, pdf } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/resume/ResumePDF';
import useUserProfile from "@/hooks/useUserProfile";
import useUserOperations from "@/hooks/useUserOperations.js";
import {Template2PDF} from "@/components/resume/Template2PDF.js";
import useTabTitle from "@/hooks/useTabTitle.js"; // Import the hook

const templates = [
    {
        name: "Template 1",
        component: ResumePDF,
    },
    {
        name: "Template 2",
        component: Template2PDF,
    },
];



export default function DashboardPage() {
    useTabTitle("Resume PDF Generator");
    const { username } = useUserOperations();
    const [isClient, setIsClient] = useState(false);
    const { userData, loading, error } = useUserProfile(username);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const handlePreviewClick = async (Component) => {
        // Generate the PDF blob from the component
        const blob = await pdf(<Component data={userData} />).toBlob();
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        // Open the URL in a new tab
        window.open(url, "_blank");
    };
    
    if (loading) {
        return <div className="container mx-auto p-6 bg-background rounded-lg border border-border"><p className="text-foreground">Loading your profile data...</p></div>;
    }
    
    if (error) {
        return <div className="container mx-auto p-6 bg-background rounded-lg border border-border"><p className="text-red-500">Error loading your profile data.</p></div>;
    }
    
    // If userData is still null or empty after loading, you might want to handle this case
    if (!userData || Object.keys(userData).length === 0) {
        return <div className="container mx-auto p-6 bg-background rounded-lg border border-border"><p className="text-foreground">No profile data found.</p></div>;
    }
    
    return (
        <div className=" mx-auto p-6 bg-background mb-16 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
                Resume PDF Generator
            </h2>
            <p className="text-[var(--foreground)] mb-4">
                To generate resume, <span className="text-secondary text-lg font-semibold">
                please fill the details in your portfolio.
            </span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                    <div key={index} className="">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{template.name}</h3>
                        {isClient ? (
                            <div className=" rounded-lg  ">
                                <PDFViewer style={{height: '416px'}} className="no-scrollba rounded-lg"
                                           showToolbar={false}>
                                    <template.component data={userData}/>
                                </PDFViewer>
                            </div>
                        ) : (
                            <p className="text-foreground">Loading preview...</p>
                        )}
                        {isClient && (
                            <div className="flex gap-2 mt-3">
                                <PDFDownloadLink
                                    document={<template.component data={userData}/>}
                                    fileName={`resume-${template.name.toLowerCase().replace(/\s+/g, '-')}-${userData?.displayName || "user"}-${Date.now()}.pdf`}
                                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                >
                                    {({loading}) =>
                                        loading ? 'Generating PDF...' : 'Download PDF'
                                    }
                                </PDFDownloadLink>
                                <button
                                    onClick={() => handlePreviewClick(template.component)}
                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                >
                                    Preview
                                </button>
                            
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}