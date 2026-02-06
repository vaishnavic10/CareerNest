"use client";

import React from "react";
import Image from "next/image";
import {
    FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaExternalLinkAlt, FaCodeBranch, FaGraduationCap, FaBriefcase, FaStar // Added more icons
} from "react-icons/fa";
import { useParams } from "next/navigation";
import useUserProfile from "@/hooks/useUserProfile";
import useTabTitle from "@/hooks/useTabTitle.js"; // Adjust the import path if needed

// --- HELPER FUNCTIONS --- (Keep existing helpers: getSocialIcon, formatDateMonthYear)

// Enhanced Social Icon Getter with more flair
const getSocialIcon = (name) => {
    const baseClasses = " group-hover:text-cyan-300 transition-all duration-300 ease-in-out";
    const wrapperClasses = "relative group rounded-full p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-indigo-950";
    
    switch (name?.toLowerCase()) {
        case "github":
            return (
                <div className={wrapperClasses}>
                    <FaGithub size={26} aria-hidden="true" className={baseClasses} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out text-xs bg-black/50 text-white px-2 py-1 rounded-md whitespace-nowrap">GitHub</span>
                </div>
            );
        case "linkedin":
            return (
                <div className={wrapperClasses}>
                    <FaLinkedin size={26} aria-hidden="true" className={baseClasses} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 text-blue-500 group-hover:scale-100 transition-all duration-300 ease-in-out text-xs bg-black/50  px-2 py-1 rounded-md whitespace-nowrap">LinkedIn</span>
                </div>
            );
        case "twitter":
            return (
                <div className={wrapperClasses}>
                    <FaTwitter size={26} aria-hidden="true" className={baseClasses} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all text-cyan-300 duration-300 ease-in-out text-xs bg-black/50  px-2 py-1 rounded-md whitespace-nowrap">Twitter</span>
                </div>
            );
        default:
            return null;
    }
};


const formatDateMonthYear = (dateString) => {
    if (!dateString) return null;
    try {
        const date = new Date(`${dateString}T00:00:00Z`);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            timeZone: "UTC",
        });
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return dateString;
    }
};


// --- COMPONENT ---

export default function UserProfilePage() {
    useTabTitle("User Portfolio");
    const { username } = useParams();
    const { userData, loading, error } = useUserProfile(username);
    
 
    if (!userData || Object.keys(userData).length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen text-foreground">
                <p className="text-lg">User not found or no data available.</p>
            </div>
        );
    }
    
    return (
        // Enhanced background gradient and overall container
        <div className="min-h-screen bg-gradient-to-br from-background via-senary to-background text-foreground font-sans antialiased selection:bg-cyan-300 selection:text-cyan-900">
            {/* Optional: Add subtle background grid pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"> {/* Increased max-width */}
                {/* === HEADER === */}
                {/* Consider adding animation library for reveal effect */}
                <header className="mb-16 md:mb-20 relative">
                    {/* Decorative Gradient Blobs (optional) */}
                    <div aria-hidden="true" className="absolute top-0 -left-4 w-72 h-72 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div aria-hidden="true" className="absolute top-0 -right-4 w-72 h-72 bg-cyan-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        {/* Profile Picture - Animated Border */}
                        <div className="flex-shrink-0 group">
                            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 ease-out">
                                {userData.photoURL ? (
                                    <Image
                                        src={userData.photoURL}
                                        alt={`${userData.displayName || userData.username || "User"}'s Profile`}
                                        className="rounded-full object-cover border-4 border-primary"
                                        width={224}
                                        height={224}
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-senary to-primary rounded-full flex items-center justify-center">
                                        <span className="text-foreground/70 text-6xl sm:text-7xl md:text-8xl font-semibold select-none opacity-80">
                                            {userData.displayName?.charAt(0) || userData.username?.charAt(0) || "?"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* User Info - Refined Typography & Layout */}
                        <div className="text-center lg:text-left flex-grow mt-4 lg:mt-0">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                                {userData.displayName || userData.username || "User Name"}
                            </h1>
                            {userData.title && (
                                <p className="text-xl sm:text-2xl lg:text-3xl text-foreground font-medium mb-5 tracking-wide">{userData.title}</p>
                            )}
                            <p className="text-foreground text-base sm:text-lg opacity-70 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                {userData.bio || "Bio not available."}
                            </p>
                            {/* Social Links with Tooltips */}
                            <div className="flex justify-center lg:justify-start space-x-5 mt-8">
                                {Array.isArray(userData.socialLinks) && userData.socialLinks.length > 0 ? (
                                    userData.socialLinks.map((link) => {
                                        const iconElement = getSocialIcon(link.name);
                                        if (!link.url || !iconElement) return null;
                                        return (
                                            <a
                                                key={link.name}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Link to ${userData.displayName || 'user'}'s ${link.name}`}
                                            >
                                                {iconElement}
                                            </a>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No social links.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Details Section - Glassmorphism Card */}
                    <div className="mt-16 bg-background/5 backdrop-blur-lg border border-border rounded-xl shadow-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm transition-all duration-300 hover:border-white/20">
                        {[
                            { icon: FaEnvelope, value: userData.email, href: `mailto:${userData.email}` },
                            { icon: FaPhone, value: userData.phone },
                            { icon: FaMapMarkerAlt, value: userData.location },
                        ].map((item, index) => item.value ? (
                                <div key={index} className="flex items-center space-x-3 group text-foreground  opacity-70 hover:text-foreground transition-colors duration-200">
                                    <item.icon className="text-pink-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={18}/>
                                    {item.href ? (
                                        <a href={item.href} className="break-all ">{item.value}</a>
                                    ) : (
                                        <span className="break-all ">{item.value}</span>
                                    )}
                                </div>
                            ) : null
                        )}
                        {!userData.email && !userData.phone && !userData.location && (
                            <p className="text-foreground/70 italic sm:col-span-2 lg:col-span-3 text-center py-2">Contact details not provided.</p>
                        )}
                    </div>
                </header>
                
                {/* === MAIN CONTENT === */}
                <main className="space-y-20 md:space-y-24">
                    
                    {/* Experience & Education Section - Enhanced Timeline */}
                    {((Array.isArray(userData.experience) && userData.experience.length > 0) ||
                        (Array.isArray(userData.education) && userData.education.length > 0)) && (
                        // Consider adding scroll reveal animations here
                        <section className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-20">
                            {/* Experience */}
                            {Array.isArray(userData.experience) && userData.experience.length > 0 && (
                                <article>
                                    <h2 className="inline-flex items-center text-2xl sm:text-3xl font-bold mb-10 text-foreground/85 tracking-tight">
                                        Experience
                                    </h2>
                                    <div className="relative border-l-2 border-dashed border-pink-500/30 pl-9 space-y-12">
                                        {userData.experience.map((exp, index) => (
                                            <div key={exp._id || index} className="relative group">
                                                {/* Enhanced Timeline Marker */}
                                                <div
                                                    className="absolute -left-[49px] top-1 w-6 h-6 bg-pink-600/50 rounded-full border-2 border-pink-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-500">
                                                    <div
                                                        className="w-2 h-2 bg-pink-500/80 rounded-full transition-all duration-300 group-hover:bg-pink-500"></div>
                                                </div>
                                                {/* Content Card */}
                                                <div
                                                    className="bg-background/5 border border-border rounded-lg p-5 shadow-md transition-all duration-300 hover:border-white/20 hover:shadow-lg transform hover:-translate-y-1">
                                                    <p className="text-pink-500 text-xs uppercase tracking-wider mb-1 font-semibold">
                                                        {formatDateMonthYear(exp.startDate) || "Start Date"} - {exp.endDate ? formatDateMonthYear(exp.endDate) : "Present"}
                                                    </p>
                                                    <h3 className="font-semibold text-lg sm:text-xl text-foreground/80 mb-1">{exp.title}</h3>
                                                    <p className="text-base text-foreground/60 font-medium mb-3">
                                                        {exp.company}
                                                        {exp.location && <span
                                                            className="text-foreground/50 text-sm"> · {exp.location}</span>}
                                                    </p>
                                                    <p className="text-sm text-foreground/50 whitespace-pre-line leading-relaxed">
                                                        {exp.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            )}
                            
                            {/* Education */}
                            {Array.isArray(userData.education) && userData.education.length > 0 && (
                                <article>
                                    <h2 className="inline-flex items-center text-2xl sm:text-3xl font-bold mb-10 text-foreground/85 tracking-tight">
                                    Education
                                    </h2>
                                    <div className="relative border-l-2 border-dashed border-cyan-500/30 pl-9 space-y-12">
                                        {userData.education.map((edu, index) => (
                                            <div key={edu._id || index} className="relative group">
                                                <div className="absolute -left-[49px] top-1 w-6 h-6 bg-cyan-500/50 rounded-full border-2 border-cyan-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500">
                                                    <div className="w-2 h-2 bg-cyan-500/80 rounded-full transition-all duration-300 group-hover:bg-cyan-500"></div>
                                                </div>
                                                <div className="bg-background/5 border border-border rounded-lg p-5 shadow-md transition-all duration-300 hover:border-white/20 hover:shadow-lg transform hover:-translate-y-1">
                                                    <p className="text-cyan-400 text-xs uppercase tracking-wider mb-1 font-semibold">
                                                        Graduated: {formatDateMonthYear(edu.graduationDate) || "N/A"}
                                                    </p>
                                                    <h3 className="font-semibold text-lg sm:text-xl text-foreground/70 mb-1">
                                                        {edu.degree} <span className="text-foreground/70 font-normal">- {edu.major}</span>
                                                    </h3>
                                                    <p className="text-base text-foreground/80 font-medium mb-3">
                                                        {edu.institution}
                                                    </p>
                                                    {edu.description && (
                                                        <p className="text-sm text-foreground/50 mt-1 leading-relaxed">{edu.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            )}
                        </section>
                    )}
                    
                    {/* Featured Projects Section - Enhanced Cards */}
                    {Array.isArray(userData.projects) && userData.projects.length > 0 && (
                        <section>
                            <h2 className="inline-flex items-center text-2xl sm:text-3xl font-bold mb-10 text-foreground tracking-tight">
                                <FaStar className="mr-3 text-secondary" /> Featured Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Consider scroll reveal for cards */}
                                {userData.projects.map((project, index) => (
                                    <article
                                        key={project._id || index}
                                        className="relative group bg-gradient-to-br from-background/5 to-transparent border border-border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden flex flex-col backdrop-blur-md hover:border-foreground/50 transform hover:-translate-y-1"
                                    >
                                        {/* Image with Overlay */}
                                        <div className="relative w-full aspect-[16/10] overflow-hidden">
                                            {project.liveLink ? (
                                                <iframe
                                                    src={project.liveLink}
                                                    title={project.name || "Project preview"}
                                                    className="w-full h-full border-none"
                                                />
                                            ) : project.imageUrl ? (
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={project.name || "Project visual"}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-senary to-secondary flex items-center justify-center text-sm text-foreground/70 italic">
                                                    <span>Project Visual</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                        </div>
                                        
                                        {/* Content Area */}
                                        <div className="p-5 sm:p-6 flex flex-col flex-grow z-10">
                                            {/* Tech Tags - positioned absolutely */}
                                            {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                                                <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5 z-20">
                                                    {project.technologies.slice(0, 3).map((tech, idx) => ( // Show max 3 initially
                                                        <span
                                                            key={idx}
                                                            className="bg-senary/95 text-foreground border border-border/30 rounded-full px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-sm"
                                                            title={tech} // Show full name on hover
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground transition-colors duration-300">
                                                {project.name || "Unnamed Project"}
                                            </h3>
                                            <p className="text-sm sm:text-base text-foreground/50 mb-5 flex-grow leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300"> {/* Expand description on hover */}
                                                {project.description || "No description provided."}
                                            </p>
                                            
                                            {/* Links - Enhanced */}
                                            <div className="flex items-center space-x-4 mt-auto pt-4 border-t border-border">
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-xs font-medium text-accent hover:text-accent transition-colors duration-200 bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-md"
                                                    >
                                                        <FaExternalLinkAlt className="mr-1.5" size={12}/> Live Demo
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-xs font-medium text-primary/60 hover:text-primary transition-colors duration-200 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md"
                                                    >
                                                        <FaCodeBranch className="mr-1.5" size={12}/> GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* Skills Section - Enhanced Tags & Layout */}
                    {Array.isArray(userData.skills) && userData.skills.length > 0 && (
                        <section>
                            <h2 className="inline-flex items-center text-2xl sm:text-3xl font-bold mb-10 text-foreground tracking-tight">
                                {/* Choose an appropriate icon, maybe FaCode or FaTools */}
                                <FaStar className="mr-3 text-tertiary" /> Skills & Expertise
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Consider scroll reveal */}
                                {userData.skills.map((skillCategory, index) => (
                                    <article
                                        key={skillCategory.category || index}
                                        className="p-6 group bg-gradient-to-br from-background/5 to-transparent border border-border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden flex flex-col backdrop-blur-md hover:border-foreground/50 transform hover:-translate-y-1"
                                    >
                                        <h3 className="text-lg sm:text-xl font-semibold mb-5 text-foreground opacity-80 tracking-wide">
                                            {skillCategory.category}
                                        </h3>
                                        {Array.isArray(skillCategory.items) && skillCategory.items.length > 0 ? (
                                            <ul className="flex flex-wrap gap-2.5">
                                                {skillCategory.items.map((skill, skillIndex) => (
                                                    <li
                                                        key={skillIndex}
                                                        className="inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/10 border border-border/30 text-primary/60 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm cursor-default transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-primary/50"
                                                    >
                                                        {/* Optional: Add small icon based on skill type? */}
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-foreground/70 text-sm italic">
                                                Skills in this category not specified.
                                            </p>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* Call To Action Section - More Dynamic */}
                    <section className="pt-16 pb-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-300 to-purple-400 p-10 sm:p-8 text-center shadow-2xl">
                            {/* Enhanced Background Elements */}
                            <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-30 mix-blend-overlay">
                                <svg className="absolute left-[50%] top-[50%] ml-[-10rem] -mt-10 h-[40rem] w-[40rem] animate-spin-slow stroke-white/20 [mask-image:radial-gradient(circle_at_center,white,transparent)]" aria-hidden="true">
                                    <defs><pattern id="ctaPattern" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30" stroke="currentColor" strokeWidth=".5"></path></pattern></defs><rect width="100%" height="100%" stroke="none" fill="url(#ctaPattern)"></rect>
                                </svg>
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-5 text-white tracking-tight">
                                Ready to Collaborate?
                            </h2>
                           <p className="text-sm sm:text-md lg:text-lg text-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                               Whether you have a project in mind, a question, or just want to connect, feel free to reach out. Let&apos;s build something great together!
                           </p>
                            <a
                                href={`mailto:${userData.email || '#'}`}
                                className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-medium text-white transition-all duration-200 bg-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white group hover:bg-secondary-600 backdrop-blur-sm"
                            >
                                <FaEnvelope className="mr-3" size={20} /> Email Me
                            </a>
                        </div>
                    </section>
                </main>
                
                {/* === FOOTER === */}
                <footer className="py-10 text-center text-foreground/70 text-sm">
                    <p>&copy; {new Date().getFullYear()} {userData.displayName || userData.username || "User"}. All rights reserved.</p>
                    {/* Consider adding a link to your portfolio or website here */}
                </footer>
            </div>
        </div>
    );
}