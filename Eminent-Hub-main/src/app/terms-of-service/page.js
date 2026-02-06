"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import useTabTitle from "@/hooks/useTabTitle.js";

const TermsOfServiceContent = () => (
    <div className="max-w-none text-foreground">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Terms of Service</h1> {/* Responsive Tailwind for h1 */}
        
        <p className="mb-4">Please read these Terms of Service carefully before using our platform. By accessing or using our platform, you agree to be bound by these Terms.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Acceptance of Terms</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">These Terms of Service constitute a legally binding agreement between you and Eminent Hub. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Use of Eminent Hub</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">Eminent Hub provides a platform for professionals to build their online presence by showcasing skills, writing blogs, and creating portfolios and resumes. You agree to use Eminent Hub in accordance with these Terms and any applicable laws and regulations. You agree not to use our platform for any unlawful or prohibited purpose.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">User Accounts</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">If you create an account on Eminent Hub, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to keep your information updated.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">User Content</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">You may be able to submit or upload content to Eminent Hub, including your skills, blog posts, portfolio items, and resume information (&quot;User Content&quot;). You retain ownership of your User Content, but by submitting it, you grant Eminent Hub a non-exclusive, worldwide, royalty-free, perpetual, irrevocable, sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display your User Content on the Eminent Hub platform for the purpose of providing and promoting our services.</p>
        <p className="mb-4">You represent and warrant that you have all necessary rights to grant the licenses in this section and that your User Content does not violate the rights of any third party, including copyright, trademark, privacy, or other personal or proprietary rights.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Prohibited Conduct</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">You agree not to engage in any of the following prohibited conduct on Eminent Hub:</p>
        <ul className="list-disc list-inside mb-4">
            <li>Violating any applicable laws or regulations.</li>
            <li>Infringing upon the intellectual property rights of others (e.g., posting copyrighted material without permission).</li>
            <li>Uploading or transmitting malicious software, viruses, or any other harmful code.</li>
            <li>Attempting to gain unauthorized access to any part of Eminent Hub or other users&apos; accounts.</li>
            <li>Interfering with the operation or security of Eminent Hub, including but not limited to denial-of-service attacks.</li>
            <li>Collecting or harvesting personal information of other users without their explicit consent.</li>
            <li>Impersonating another person or entity, or misrepresenting your affiliation with any person or entity.</li>
            <li>Posting content that is defamatory, libelous, harassing, abusive, threatening, discriminatory, or otherwise objectionable.</li>
            <li>Using Eminent Hub for spamming, advertising, or other forms of unauthorized solicitation.</li>
            <li>Creating multiple accounts for disruptive purposes.</li>
        </ul>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Intellectual Property</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">Eminent Hub and its original content, features, and functionality (excluding User Content) are owned by Eminent Hub and are protected by copyright, trademark, and other intellectual property laws. You may not modify, reproduce, distribute, create derivative works of, publicly display, or in any way exploit any of our intellectual property without our prior written consent.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Termination</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">We may terminate or suspend your access to Eminent Hub at any time, with or without cause, and without prior notice or liability. Reasons for termination may include, but are not limited to, violation of these Terms. Upon termination, your right to use Eminent Hub will immediately cease.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Disclaimer of Warranties</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">EMINENT HUB IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT EMINENT HUB WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, NOR DO WE MAKE ANY WARRANTY AS TO THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT OR INFORMATION AVAILABLE THROUGH OUR PLATFORM.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Limitation of Liability</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EMINENT HUB, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES) ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF, OR YOUR INABILITY TO ACCESS OR USE, EMINENT HUB.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Governing Law</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Changes to These Terms</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">We may revise these Terms of Service at any time by posting the updated Terms on Eminent Hub. Your continued use of Eminent Hub after the posting of revised Terms constitutes your acceptance of the changes. It is your responsibility to review these Terms periodically.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Us</h2> {/* Responsive Tailwind for h2 */}
        <p className="mb-4">If you have any questions about these Terms of Service, please contact us at:</p>
        <address className="mb-4">
            Eminent Hub<br />
            [Your Company Address - Replace with your actual address]<br />
            Email: <a href="mailto:[Your Contact Email Address]" className="hover:underline">[Your Contact Email Address - Replace with your actual email]</a>
        </address>
    </div>
);

export default function TermsOfService() {
    useTabTitle("Terms of Service");
    return (
        <>
            <div className="flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full p-10 bg-senary rounded-xl shadow-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Terms of Service</h1> {/* Responsive Tailwind for main title */}
                    </div>
                    <TermsOfServiceContent />
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