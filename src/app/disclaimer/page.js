"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import useTabTitle from "@/hooks/useTabTitle.js";

const DisclaimerContent = () => (
    <div className="max-w-none text-foreground">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Disclaimer</h1>
        
        <p className="mb-4">Please read this disclaimer carefully before using our platform.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">General Information</h2>
        <p className="mb-4">The information provided on Eminent Hub is for general informational purposes only and does not constitute professional advice. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to Eminent Hub or the information, profiles, blog posts, portfolios, resumes, services, or related graphics contained on the platform for any purpose. Any reliance you place on such information is therefore strictly at your own risk.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">No Professional Advice</h2>
        <p className="mb-4">The content on Eminent Hub, including user profiles, blog posts, and portfolio examples, is not intended to be a substitute for direct professional consultation or advice. While we aim to connect professionals and showcase their skills, Eminent Hub does not endorse or guarantee the expertise or qualifications of any user. Always exercise your own judgment and seek the advice of qualified professionals for any specific needs or questions you may have.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">External Links</h2>
        <p className="mb-4">Eminent Hub may contain links to external websites or resources, including user-provided links in portfolios or blog posts. These links are provided for your convenience only, and we have no control over the content and nature of these external sites. The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p className="mb-4">In no event will Eminent Hub be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of Eminent Hub or reliance on any information or profiles presented on the platform.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Errors and Omissions</h2>
        <p className="mb-4">While we strive to provide a reliable platform, Eminent Hub may contain information provided by users which could include errors or omissions. We do not warrant that the platform will be error-free, and we are not responsible for any errors or omissions, or for the results obtained from the use of this information or reliance on user-generated content.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Views and Opinions</h2>
        <p className="mb-4">Any views or opinions expressed by users on Eminent Hub, such as in blog posts or profile descriptions, are those of the individual authors or contributors and do not necessarily reflect the official policy or position of Eminent Hub.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Changes to This Disclaimer</h2>
        <p className="mb-4">We may update this disclaimer from time to time without notice. Your continued use of Eminent Hub after any such changes constitutes your acceptance of the new disclaimer. It is your responsibility to review this disclaimer periodically.</p>
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">If you have any questions regarding this disclaimer, please contact us at:</p>
        <address className="mb-4">
            Eminent Hub<br />
            [Your Company Address - Replace with your actual address]<br />
            Email: <a href="mailto:[Your Contact Email Address]" className="hover:underline">[Your Contact Email Address - Replace with your actual email]</a>
        </address>
    </div>
);

export default function Disclaimer() {
    useTabTitle("Disclaimer");
    return (
        <>
            <div className="flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full p-10 bg-senary rounded-xl shadow-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Disclaimer</h1>
                    </div>
                    <DisclaimerContent />
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