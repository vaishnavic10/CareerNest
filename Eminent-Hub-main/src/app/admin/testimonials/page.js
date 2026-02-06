// pages/admin/TestimonialsSection.js
"use client";

import EditTestimonialsModal from '@/components/modal/EditTestimonialsModal';
import { useState, useEffect } from 'react';
import useTestimonials from '@/hooks/useTestimonials';
import Button from '@/components/Button';
import InputBox from '@/components/Input';
import Pagination from '@/components/dashboard/Pagination';

const TestimonialsPage = () => {
    const { loading, error, testimonials, getAllTestimonials } = useTestimonials();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [testimonialsPerPage, setTestimonialsPerPage] = useState(10);
    
    useEffect(() => {
        getAllTestimonials();
    }, [getAllTestimonials]);
    
    const handleAdd = () => {
        setSelectedTestimonial({ userEmail: '', message: '', authorName: '', authorTitle: '' });
        setIsAddingNew(true);
        setIsModalOpen(true);
    };
    
    const handleEdit = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsAddingNew(false);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsAddingNew(false);
        setSelectedTestimonial(null);
        getAllTestimonials(); // Refresh testimonials after modal close
    };
    
    const handleTestimonialsPerPageChange = (e) => {
        setTestimonialsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    
    const filteredTestimonials = Array.isArray(testimonials)
        ? testimonials.filter(testimonial =>
            searchQuery === '' ||
            testimonial.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            testimonial.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            testimonial.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];
    
    const indexOfLastTestimonial = currentPage * testimonialsPerPage;
    const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
    const currentTestimonials = filteredTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    if (loading) return <p className="text-center text-gray-500">Loading testimonials...</p>;
    if (error) return <p className="text-center text-red-500">Error loading testimonials: {error}</p>;
    
    return (
        <div className="h-full px-4 pb-10 bg-background rounded-lg flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Testimonials</h1>
            <div className="flex justify-between items-center mb-4">
                <Button onClick={handleAdd} variant="secondary">
                    Add Testimonial
                </Button>
                <InputBox
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-auto"
                />
                <select
                    value={testimonialsPerPage}
                    onChange={handleTestimonialsPerPageChange}
                    className="border border-border p-2 rounded-md text-foreground bg-background"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>
            {currentTestimonials && currentTestimonials.length > 0 ? (
                <ul className="space-y-4">
                    {currentTestimonials.map((testimonial) => (
                        <li
                            key={testimonial._id}
                            className="p-4 border border-border rounded-lg shadow-sm cursor-pointer"
                            onClick={() => handleEdit(testimonial)}
                        >
                            <p className="mb-2">{testimonial.message ? (testimonial.message.length > 100 ? `${testimonial.message.substring(0, 100)}...` : testimonial.message) : 'No message available'}</p>
                            <p className="text-sm italic">
                                - {testimonial.authorName || 'Anonymous'}, {testimonial.authorTitle || 'No Title'} ({testimonial.userEmail || 'No Email'})
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No testimonials found.</p>
            )}
            
            <Pagination
                currentPage={currentPage}
                onPageChange={paginate}
                totalItems={filteredTestimonials.length}
                itemsPerPage={testimonialsPerPage}
            />
            
            <EditTestimonialsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedTestimonial}
                isNew={isAddingNew}
            />
        </div>
    );
};

export default TestimonialsPage;