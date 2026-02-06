import React, { useState, useRef } from "react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import useClickOutside from "@/hooks/useClickOutside"; // Adjust the path as needed

export default function TableOfContents({ toc }) {
    // Separate state for desktop and mobile
    const [desktopTOCOpen, setDesktopTOCOpen] = useState(true);
    const [mobileTOCOpen, setMobileTOCOpen] = useState(false);
    const mobileTOCRef = useRef(null);
    
    // Close mobile TOC when clicking outside
    useClickOutside(mobileTOCRef, () => {
        if (mobileTOCOpen) setMobileTOCOpen(false);
    });
    
    // Animated container helper (for mobile)
    const animatedContainer = (children, isOpen) => (
        <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: isOpen ? "1000px" : "0px" }}
        >
            {children}
        </div>
    );
    
    return (
        <>
            {/* Desktop Version */}
            <aside className="hidden lg:block lg:pr-4 lg:sticky lg:top-6">
                <div className="bg-background p-4 rounded-lg border border-border">
                    {/* TOC Header with Toggle */}
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setDesktopTOCOpen(!desktopTOCOpen)}
                    >
                        <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
                        {desktopTOCOpen ? (
                            <RiArrowUpSLine size={24} />
                        ) : (
                            <RiArrowDownSLine size={24} />
                        )}
                    </div>
                    {desktopTOCOpen && (
                        <ul className="list-disc pl-5">
                            {toc.map((heading) => (
                                <li key={heading.id} className="mb-1">
                                    <a
                                        href={`#${heading.id}`}
                                        className="text-foreground hover:underline"
                                    >
                                        {heading.text}
                                    </a>
                                    {heading.children.length > 0 && (
                                        <ul className="list-disc pl-4 mt-1">
                                            {heading.children.map((sub) => (
                                                <li key={sub.id} className="mb-1">
                                                    <a
                                                        href={`#${sub.id}`}
                                                        className="text-foreground hover:underline text-sm"
                                                    >
                                                        {sub.text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
            
            {/* Mobile Version */}
            <div className="fixed z-50 top-1/4 -translate-y-1/4 right-0 lg:hidden">
                <button
                    type="button"
                    className="p-2 rounded-l-full bg-background shadow-lg"
                    aria-label="Show table of contents"
                    onClick={() => setMobileTOCOpen(!mobileTOCOpen)}
                >
                    {mobileTOCOpen ? <RiArrowUpSLine size={24} /> : <RiArrowDownSLine size={24} />}
                </button>
                {mobileTOCOpen && (
                    <div
                        ref={mobileTOCRef}
                        className="absolute top-10 right-6 w-64 bg-senary/100 backdrop-blur-3xl rounded-lg text-foreground border-border border shadow-md p-4"
                    >
                        <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
                        {animatedContainer(
                            <ul className="list-disc pl-5">
                                {toc.map((heading) => (
                                    <li key={heading.id} className="mb-1">
                                        <a
                                            href={`#${heading.id}`}
                                            className="text-foreground hover:underline"
                                        >
                                            {heading.text}
                                        </a>
                                        {heading.children.length > 0 && (
                                            <ul className="list-disc pl-4 mt-1">
                                                {heading.children.map((sub) => (
                                                    <li key={sub.id} className="mb-1">
                                                        <a
                                                            href={`#${sub.id}`}
                                                            className="text-foreground hover:underline text-sm"
                                                        >
                                                            {sub.text}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>,
                            mobileTOCOpen
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
