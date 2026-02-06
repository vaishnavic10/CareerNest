"use client";
import { useState } from "react";

// Sample FAQs Data
const faqs = [
    {
        id: "1",
        question: "How do I create my personal portfolio?",
        answer:
            "To create your personal portfolio, simply sign up on our platform and start adding your projects, blogs, and skills.",
    },
    {
        id: "2",
        question: "Will I need to manually create my resume?",
        answer:
            "No, after filling your portfolio details, your resume will be automatically generated.",
    },
    {
        id: "3",
        question: "Can I edit my portfolio after it's been published?",
        answer:
            "Yes, you can edit most details of your portfolio after it has been published. Go to the 'Portfolio' section, select your portfolio, and click on the 'Edit' button.",
    },
    {
        id: "4",
        question: "How do I create a blog post?",
        answer:
            "To create a blog post, go to the 'Blog' section and click on the 'Write a Post' button. From there, you can write and publish your blog post.",
    },
    {
        id: "5",
        question: "How can I contact support?",
        answer:
            "You can contact our support team via the 'Contact Us' page on our website. We aim to respond within 24 hours.",
    },
];

export default function FaqSection() {
    const [open, setOpen] = useState(null);
    
    const toggleFaq = (id) => {
        setOpen((prev) => (prev === id ? null : id));
    };
    
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="py-4 border-b border-border">
                            <div onClick={() => toggleFaq(faq.id)} className="flex items-center cursor-pointer">
                                <h3 className="text-xl font-semibold text-foreground flex-1">
                                    {faq.question}
                                </h3>
                                <svg
                                    className={`w-6 h-6 transition-transform duration-300 ${open === faq.id ? "rotate-180" : "rotate-0"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                            {open === faq.id && (
                                <p className="mt-2 text-foreground/80">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
