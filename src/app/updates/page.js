"use client";
import Footer from "@/components/Footer";
import Link from "next/link";
import useWebsiteUpdateLogs from "@/hooks/useWebsiteUpdateLogs";
import useTabTitle from "@/hooks/useTabTitle.js";

export default function UpdateLogs() {
    useTabTitle("Website Logs");
    const { logs, loading, error } = useWebsiteUpdateLogs();
    
    if (loading) {
        return (
            <>
                <div className="flex justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl w-full p-10 bg-senary rounded-xl shadow-md text-center">
                        <p className="text-foreground">Loading update logs...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
    
    if (error) {
        return (
            <>
                <div className="flex justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl w-full p-10 bg-senary rounded-xl shadow-md text-center">
                        <p className="text-danger">Error loading update logs: {error}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
    
    return (
        <>
            <div className="bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-senary rounded-xl shadow-md p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">What&apos;s New</h1>
                        <p className="mt-2 text-foreground text-sm sm:text-base">Stay up-to-date with the latest features and improvements.</p>
                    </div>
                    
                    <ul className="space-y-4 sm:space-y-6">
                        {logs.map((log, index) => (
                            <li key={index} className="bg-background rounded-md shadow-sm p-4 sm:p-6">
                                <div className="flex items-baseline justify-between mb-2">
                                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">{log.description}</h3>
                                    <span className="text-xs sm:text-sm text-foreground/70">
                                        {new Date(log.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                        })} | Version: {log.version}
                                    </span>
                                </div>
                                <p className="text-foreground/80 mb-2 text-sm sm:text-base">
                                    Type: <span className={`font-medium ${
                                    log.type === 'Feature' ? 'text-accent' :
                                        log.type === 'Bug Fix' ? 'text-danger' :
                                            log.type === 'Improvement' ? 'text-primary' :
                                                'text-secondary'
                                }`}>{log.type}</span>
                                </p>
                                {log.details && log.details.length > 0 && (
                                    <ul className="list-disc pl-5 text-foreground/80 text-sm sm:text-base">
                                        {log.details.map((detail, i) => (
                                            <li key={i}>{detail}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    {logs.length === 0 && !loading && !error && (
                        <p className="text-foreground text-center mt-6 text-sm sm:text-base">No update logs available yet.</p>
                    )}
                    
                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-secondary hover:text-indigo-500 font-medium text-sm sm:text-base"
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