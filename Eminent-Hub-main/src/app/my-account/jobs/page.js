// components/jobs/JobListPage.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import InputBox from "@/components/Input";
import Pagination from "@/components/dashboard/Pagination.js";
import { useAuth } from "@/context/authContext";
import { formatDistanceToNow } from 'date-fns';
import Button from "@/components/Button.js";
import useJobTracking from "@/hooks/useJobTrackiing.js";
import EditJobsTrackingModal from "@/components/modal/EditJobsTrackingModal.js";
import { toast } from "react-hot-toast";

const getStatusColor = (status) => {
    const colors = {
        applied: 'text-blue-500',
        interview: 'text-yellow-500',
        offer: 'text-green-500',
        rejected: 'text-red-500',
        wishlist: 'text-purple-500',
    };
    return `bg-senary border border-border ${colors[status?.toLowerCase()]}`;
};

export default function JobListPage() {
    const { user } = useAuth();
    const {
        jobs: allJobs,
        loading,
        error,
        fetchJobs,
        addJob,
        updateJob,
        deleteJob,
        // updateJobStatus // Removed as status is handled in modal now
    } = useJobTracking();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");
    
    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJobData, setCurrentJobData] = useState(null);
    
    // --- Fetch Jobs ---
    useEffect(() => {
        if (user?.email) {
            fetchJobs(user.email).then(() => {});
        }
        // Don't reset page here, causes flicker. Reset on search/filter changes instead.
        // setCurrentPage(1);
    }, [user?.email, fetchJobs]);
    
    // --- Filtering & Pagination ---
    const filteredJobs = useMemo(() => {
        if (!allJobs) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return allJobs.filter(job => {
            const matchesSearchTerm = job.company?.toLowerCase().includes(lowerSearchTerm) ||
                job.role?.toLowerCase().includes(lowerSearchTerm) ||
                job.status?.toLowerCase().includes(lowerSearchTerm);
            const matchesStatusFilter = statusFilter ? job.status?.toLowerCase() === statusFilter.toLowerCase() : true;
            return matchesSearchTerm && matchesStatusFilter;
        });
    }, [allJobs, searchTerm, statusFilter]);
    
    const totalJobsCount = filteredJobs.length;
    const totalPages = Math.ceil(totalJobsCount / itemsPerPage);
    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredJobs.slice(startIndex, endIndex);
    }, [filteredJobs, currentPage, itemsPerPage]);
    
    // --- Modal Control Handlers ---
    const openAddModal = () => {
        setCurrentJobData(null);
        setIsModalOpen(true);
    };
    
    const openEditModal = (job) => {
        setCurrentJobData(job);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentJobData(null);
    };
    
    // --- CRUD Handlers for Modal ---
    const handleSaveJob = async (jobData) => {
        let success = false;
        const { _id, ...dataToSave } = jobData;
        
        // Basic validation example
        if (!dataToSave.company || !dataToSave.role) {
            toast.error("Company and Role are required.");
            return; // Prevent saving
        }
        
        try {
            if (_id) {
                success = await updateJob(_id, dataToSave);
            } else {
                success = await addJob({ ...dataToSave });
            }
            
            if (success) {
                if (user?.email) await fetchJobs(user.email);
                closeModal();
                toast.success(`Job ${ _id ? 'updated' : 'added' } successfully.`);
            } else {
                toast.error(`Failed to ${ _id ? 'update' : 'add' } job. The hook did not return a success value.`);
            }
        } catch (err) {
            console.error("Error saving job:", err);
            toast.error(`Error saving job: ${err.message || 'Please try again.'}`);
        }
    };
    
    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job application?")) {
            try {
                const success = await deleteJob(jobId);
                if (success) {
                    if (user?.email) await fetchJobs(user.email);
                    closeModal(); // Close modal if open
                    toast.success("Job deleted successfully.");
                } else {
                    toast.error("Failed to delete job.");
                }
            } catch (err) {
                console.error("Error deleting job:", err);
                toast.error(`Error deleting job: ${err.message || 'Please try again.'}`);
            }
        }
    };
    
    // --- Other Handlers ---
    const handlePageChange = (newPage) => {
        // Ensure page is within valid range
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        } else if (newPage < 1) {
            setCurrentPage(1);
        } else if (newPage > totalPages) {
            setCurrentPage(totalPages);
        }
    };
    
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1); // Reset to first page when items per page changes
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search term changes
    }
    
    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1); // Reset to first page when status filter changes
    };
    
    
    // --- Render Logic ---
    // Restore loading state
    if (loading && !allJobs?.length) { // Show loading only on initial load or if allJobs is null/empty
        return (
            <div className="mt-6 p-6 bg-background rounded-lg shadow-md flex-1 flex items-center justify-center">
                <p className="text-lg text-foreground">Loading job applications...</p>
                {/* Add a spinner here */}
            </div>
        );
    }
    
    // Restore error state
    if (error) {
        return (
            <div className="mt-6 p-6 bg-background rounded-lg shadow-md flex-1 flex items-center justify-center">
                <p className="text-lg text-danger">
                    Error loading jobs: {error}
                </p>
            </div>
        );
    }
    
    return (
        <div className="h-full px-4 pb-10 bg-background rounded-lg flex-1 flex flex-col">
            {/* --- Header and Add Button --- */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h2 className="text-2xl font-semibold text-foreground">
                    My Job Applications
                </h2>
                <Button variant="success" onClick={openAddModal} className="flex items-center gap-2">
                    Add Job
                </Button>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">Track your job applications here.</p>
            
            {/* --- Filter and Pagination Controls --- */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <InputBox
                    type="text"
                    placeholder="Search by Company, Role, Status..."
                    value={searchTerm}
                    onChange={handleSearchChange} // Use updated handler
                    className="border border-border p-2 rounded-md text-foreground bg-input flex-grow sm:flex-grow-0 w-full sm:w-auto"
                />
                
                <div className="flex items-center justify-end w-full sm:w-auto gap-2">
                    <div className="flex items-center justify-end w-full sm:w-auto">
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="border border-border p-2 rounded-md bg-senary text-foreground bg-input text-sm"
                        >
                            <option value="">All</option>
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                            <option value="wishlist">Wishlist</option>
                        </select>
                    </div>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-border p-2 rounded-md bg-senary text-foreground bg-input text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            
            {/* --- Desktop Table Layout --- */}
            <div className="hidden md:block overflow-x-auto mb-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-muted text-muted-foreground sticky top-0 z-10">
                        <th className="p-2 border-b border-border">Company</th>
                        <th className="p-2 border-b border-border">Role</th>
                        <th className="p-2 border-b border-border">Status</th>
                        <th className="p-2 border-b border-border">Applied</th>
                        <th className="p-2 border-b border-border">Notes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedJobs.length > 0 ? (
                        paginatedJobs.map((job) => (
                            <tr key={job._id} className="hover:bg-muted/50 transition-colors text-sm align-top cursor-pointer" onClick={() => openEditModal(job)}>
                                <td className="p-2 border-b border-border font-medium">{job.company || "N/A"}</td>
                                <td className="p-2 border-b border-border">{job.role || "N/A"}</td>
                                <td className="p-2 border-b border-border">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                                        {job.status || "N/A"}
                                    </span>
                                </td>
                                <td className="p-2 border-b border-border whitespace-nowrap">
                                    {job.appliedAt
                                        ? formatDistanceToNow(new Date(job.appliedAt), { addSuffix: true })
                                        : "N/A"}
                                </td>
                                <td className="p-2 border-b border-border max-w-xs whitespace-pre-wrap break-words">{job.notes || ""}</td>
                            </tr>
                        ))
                    ) : (
                        // Corrected: "No jobs found" row for desktop table
                        <tr>
                            <td colSpan="5" className="text-center p-4 text-muted-foreground">
                                No job applications found matching your criteria.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            
            
            {/* --- Mobile Card Layout (Corrected Ternary) --- */}
            <div className="md:hidden flex flex-col gap-4 mb-6">
                {paginatedJobs.length > 0 ? (
                    paginatedJobs.map((job) => (
                        <div key={job._id} className="p-4 bg-card border border-border rounded-md shadow hover:shadow-lg transition-shadow text-card-foreground cursor-pointer" onClick={() => openEditModal(job)}>
                            <div className="flex justify-between items-start mb-2 gap-2">
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-base break-words">{job.company || "N/A"}</h3>
                                    <p className="text-sm text-muted-foreground break-words">{job.role || "N/A"}</p>
                                </div>
                                <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                                    {job.status || "N/A"}
                                </span>
                            </div>
                            <div className="text-sm mb-2">
                                <strong className="text-muted-foreground">Applied:</strong> {job.appliedAt ? formatDistanceToNow(new Date(job.appliedAt), { addSuffix: true }) : "N/A"}
                            </div>
                            {job.notes && (
                                <div className="text-sm mb-3 bg-muted p-2 rounded">
                                    <strong className="text-muted-foreground block mb-1">Notes:</strong>
                                    <p className="whitespace-pre-wrap break-words">{job.notes}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    // Corrected: "No jobs found" message for mobile layout
                    <div className="text-center py-4">
                        <p className="text-muted-foreground">
                            No job applications found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
            
            {/* --- Pagination Component --- */}
            {/* Only show pagination if there's more than one page */}
            {totalPages > 1 && (
                <div className="mt-auto pt-4"> {/* Push pagination to bottom */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
            
            {/* --- Render the Modal --- */}
            {/* Render modal conditionally - improves performance slightly */}
            {isModalOpen && (
                <EditJobsTrackingModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    data={currentJobData}
                    onSave={handleSaveJob}
                    onDelete={handleDeleteJob}
                />
            )}
        </div>
    );
}

