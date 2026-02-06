"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { FaSearch, FaQuestionCircle } from "react-icons/fa";
import useTabTitle from "@/hooks/useTabTitle.js";

const faqData = [
    {
        id: 1,
        question: "How do I create my professional profile on Eminent Hub?",
        answer: "To create your profile, sign up or log in to Eminent Hub. Then, navigate to the 'Profile' section in your dashboard. You can add your personal details, skills, experience, and a professional bio.",
    },
    {
        id: 2,
        question: "How can I showcase my skills on my profile?",
        answer: "In the 'Profile' section, you'll find an option to add your skills. You can list your areas of expertise and even provide details or examples for each skill.",
    },
    {
        id: 3,
        question: "How do I write and publish a blog post on Eminent Hub?",
        answer: "Go to the 'Blog' section in your dashboard and click on 'Create New Post'. You can write your content using our editor, add images, and then publish it for others to see.",
    },
    {
        id: 4,
        question: "What are the guidelines for blog content on Eminent Hub?",
        answer: "We encourage professionals to share valuable insights and expertise. Please ensure your content is original, respectful, and relevant to our community. Avoid plagiarism and any form of harmful or misleading information.",
    },
    {
        id: 5,
        question: "How can I build my online portfolio on Eminent Hub?",
        answer: "Navigate to the 'Portfolio' section in your dashboard. You can upload projects, case studies, and other work samples to showcase your abilities. You can also add descriptions and links to your projects.",
    },
    {
        id: 6,
        question: "What types of files can I upload to my portfolio?",
        answer: "We currently support various file types including images (JPEG, PNG, GIF), documents (PDF), and you can also embed links to videos or live websites.",
    },
    {
        id: 7,
        question: "How do I create a resume using Eminent Hub?",
        answer: "Go to the 'Resume' section in your dashboard. You can fill in your work experience, education, skills, and other relevant information using our resume builder. You'll be able to preview and download your resume in different formats.",
    },
    {
        id: 8,
        question: "Can I download my resume from Eminent Hub?",
        answer: "Yes, once you've created your resume, you can download it in PDF format.",
    },
    {
        id: 9,
        question: "How can I connect with other professionals on the platform?",
        answer: "You can search for other professionals using the search bar and view their profiles. You can also follow them to stay updated on their activities and connect through the platform's messaging features (if available).",
    },
    {
        id: 10,
        question: "What are the privacy settings for my profile and content?",
        answer: "You can manage your privacy settings in the 'Settings' section of your dashboard. You can control who can view your profile, blog posts, portfolio items, and resume.",
    },
    {
        id: 11,
        question: "How do I report inappropriate content or user behavior?",
        answer: "If you encounter any inappropriate content or behavior, please use the 'Report' button available on the content or profile. Our moderation team will review your report and take appropriate action.",
    },
    {
        id: 12,
        question: "What if I forget my password?",
        answer: "If you forget your password, click on the 'Forgot Password' link on the login page. Follow the instructions to reset your password via email.",
    },
    {
        id: 13,
        question: "Is there a limit to the number of blog posts or portfolio items I can have?",
        answer: "Currently, Eminent Hub offers generous limits for blog posts and portfolio items. Please refer to our subscription plans or contact support for specific details.",
    },
    {
        id: 14,
        question: "How can I update my account information?",
        answer: "You can update your account information, such as your name, email address, and password, in the 'Settings' section of your dashboard.",
    },
    {
        id: 15,
        question: "What is Eminent Hub's policy on data privacy?",
        answer: "Please refer to our <Link href='/privacy-policy' className='text-secondary hover:underline'>Privacy Policy</Link> page for detailed information on how we handle your data.",
    },
    // Add more FAQ items as needed for Eminent Hub
];

export default function HelpCenter() {
    useTabTitle("Help Center");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFaqs, setFilteredFaqs] = useState(faqData);
    const [expandedFaq, setExpandedFaq] = useState(null);
    
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = faqData.filter((faq) =>
            faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term)
        );
        setFilteredFaqs(filtered);
        setExpandedFaq(null); // Collapse all FAQs on new search
    };
    
    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };
    
    return (
        <>
            <div className="flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full p-10 bg-senary rounded-xl shadow-md">
                    <div className="text-center mb-8">
                        {/*<FaQuestionCircle className="inline-block text-4xl text-secondary mb-2" />*/}
                        <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
                        <p className="mt-2 text-foreground">Find answers to your frequently asked questions about Eminent Hub.</p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/50">
                            <FaSearch className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            className="shadow appearance-none border border-border rounded-lg w-full py-2 pl-10 pr-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-senary"
                            placeholder="Search for questions or keywords related to profiles, blogs, portfolios, etc..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    
                    {/* FAQ List */}
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                        {filteredFaqs.length > 0 ? (
                            <ul className="space-y-4">
                                {filteredFaqs.map((faq) => (
                                    <li key={faq.id} className="bg-senary rounded-md shadow-sm p-4">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleFaq(faq.id)}
                                        >
                                            <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
                                            <svg
                                                className={`w-5 h-5 text-foreground transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {expandedFaq === faq.id && (
                                            <div className="mt-2 text-foreground">
                                                {faq.answer}
                                                {faq.id === 15 && (
                                                    <p className="mt-2">
                                                        For more details, please visit our <Link href="/privacy-policy" className="text-secondary hover:underline">Privacy Policy</Link> page.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-foreground">No FAQs found matching your search term.</p>
                        )}
                    </div>
                    
                    <div className="mt-8 text-center">
                        <p className="text-foreground mb-2">Didn&rsquo;t find what you were looking for?</p>
                        <Link
                            href="/contact" // Replace with your actual contact page URL
                            className="text-secondary hover:text-indigo-500 font-medium"
                        >
                            Contact Our Support Team
                        </Link>
                        <p className="mt-4">
                            <Link
                                href="/"
                                className="text-foreground hover:text-secondary font-medium"
                            >
                                Go back to Home
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}