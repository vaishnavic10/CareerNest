"use client"; // This line tells Next.js to render this component on the client

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle } from "react-icons/fa";
import {useAuth} from "@/context/authContext";
import Image from "next/image";

function Footer() {
    const { role } = useAuth();
    
    if (role === "admin") {
        return null;
    }
    return (
        <div className="relative">
            <footer className="bg-background text-foreground py-8 border-t border-border">
                {/* Footer Content */}
                <div className="px-4">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
                            <div className="text-center lg:text-left">
                                <Link href="/" className="flex items-center">
                                    <Image src="/logos.png" alt="Eminent Hub" className="w-12 h-12 mr-2" width={48} height={48}/>
                                    <h2 className="text-2xl font-bold">Eminent Hub</h2>
                                </Link>
                                <p className="mt-4">
                                    Showcase your skills, write a blog, build a portfolio and resume.
                                </p>
                                {/*<div className="flex justify-center lg:justify-start items-center mt-4 space-x-4">*/}
                                {/*    <FaFacebookF className="cursor-pointer hover:text-secondary"/>*/}
                                {/*    <FaTwitter className="cursor-pointer hover:text-secondary"/>*/}
                                {/*    <FaInstagram className="cursor-pointer hover:text-secondary"/>*/}
                                {/*    <FaGoogle className="cursor-pointer hover:text-secondary"/>*/}
                                {/*</div>*/}
                            </div>
                            
                            <div className="text-center lg:text-left">
                                <h3 className="text-lg font-semibold">Company</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><Link href="/about" className="cursor-pointer hover:underline">About Us</Link>
                                    </li>
                                    <li><Link href="/contact" className="cursor-pointer hover:underline">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="text-center lg:text-left">
                                <h3 className="text-lg font-semibold">Support</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><Link href="/help" className="cursor-pointer hover:underline">Help Center</Link></li>
                                    <li><Link href="/bug" className="cursor-pointer hover:underline">Bug Report</Link></li>
                                    <li><Link href="/updates" className="cursor-pointer hover:underline">Web Update Logs</Link></li>
                                    <li><Link href="/contribute" className="cursor-pointer hover:underline">Contribute</Link></li>
                                    <li><Link href="/feature" className="cursor-pointer hover:underline">Feature Request</Link></li>
                                </ul>
                            </div>
                            
                            <div className="text-center lg:text-left">
                                <h3 className="text-lg font-semibold">Legal</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><Link href="/privacy-policy" className="cursor-pointer hover:underline">Privacy Policy</Link></li>
                                    <li><Link href="/terms-of-service" className="cursor-pointer hover:underline">Terms of Service</Link></li>
                                    <li><Link href="/disclaimer" className="cursor-pointer hover:underline">Disclaimer</Link></li>
                                    <li><Link href="/sitemap" className="cursor-pointer hover:underline">Sitemap</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="my-6 border-border"/>
                    
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <p className="text-center md:mr-4">© {new Date().getFullYear()} All rights reserved.</p>
                        <p className="text-center md:ml-4">Made with ❤️ by Kirtesh Admute</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;