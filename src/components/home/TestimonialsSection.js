"use client";
import { useEffect } from "react";
import useTestimonials from "@/hooks/useTestimonials";

export default function TestimonialsSection() {
    const { testimonials, getAllTestimonials } = useTestimonials();
    
    useEffect(() => {
        getAllTestimonials();
    }, [getAllTestimonials]);
    
    return (
        <section className="py-16 bg-background overflow-x-auto no-scrollbar">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8 text-foreground">
                    What Our Users Say
                </h2>
                <div
                    className="flex gap-8 overflow-x-auto no-scrollbar"
                    style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
                >
                    {testimonials.map((testimonial, index) => {
                        const key = testimonial?._id?.$oid || `testimonial-${index}`;
                       
                        return (
                            <div
                                key={key}
                                className="bg-senary rounded-lg shadow-md p-6 flex-none w-80 transform transition hover:scale-105"
                            >
                                <div className="flex flex-col items-center">
                                    <p className="italic text-foreground mb-4">
                                        {testimonial?.message}
                                    </p>
                                    <h4 className="font-semibold text-lg text-foreground">
                                        {testimonial?.authorName}
                                    </h4>
                                    <p className="text-sm text-foreground/70">
                                        {testimonial?.authorTitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}