"use client";

import { useState, useEffect } from "react";
import InputBox from "@/components/Input.js";
import { useUsers } from "@/hooks/useUsers.js"; // adjust path as needed

// Pagination Component
export default function Pagination({ currentPage, onPageChange, totalItems, itemsPerPage }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Define totalPages
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-border text-foreground bg-background mr-2 disabled:opacity-50"
            >
                Previous
            </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-3 py-1 rounded-md border border-border text-foreground bg-background mx-1 ${
                        currentPage === number ? "bg-primary text-[var(--primary-foreground)]" : ""
                    }`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-border text-foreground bg-background ml-2 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};
