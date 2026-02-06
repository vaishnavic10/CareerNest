// components/jobs/JobEditModal.jsx
"use client";

import React, { useState, useEffect } from 'react';
import Modal from "@/components/Modal.js";
import InputBox from "@/components/Input";
import Button from "@/components/Button.js";
import { format } from 'date-fns';

// Define initialJobState OUTSIDE the component function scope
const initialJobState = {
    company: '',
    role: '',
    status: 'Applied',
    appliedAt: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    _id: null,
};

// Status options can also be outside
const statusOptions = [
    { value: 'Applied', label: 'Applied' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Offer', label: 'Offer' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Wishlist', label: 'Wishlist' },
];


const EditJobsTrackingModal = ({ isOpen, onClose, data, onSave, onDelete }) => {
    // Use the stable initialJobState directly
    const [editableData, setEditableData] = useState(initialJobState);
    
    useEffect(() => {
        if (isOpen) {
            // Add console log for debugging
            console.log("Modal useEffect - isOpen:", isOpen, "Data ID:", data?._id);
            if (data?._id) {
                // Editing existing job
                setEditableData({
                    company: data.company || '',
                    role: data.role || '',
                    status: data.status || 'Applied',
                    appliedAt: data.appliedAt ? format(new Date(data.appliedAt), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                    notes: data.notes || '',
                    _id: data._id,
                });
            } else {
                // Adding new job: Reset to the stable initial state
                setEditableData(initialJobState);
            }
        }
        // Keep dependencies, relying on parent providing stable `data` reference now
    }, [isOpen, data]); // Removed initialJobState from deps as it's stable now
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSave = () => {
        // onSave is memoized in parent
        onSave(editableData);
    };
    
    const handleDelete = () => {
        if (onDelete && editableData._id) {
            // onDelete is memoized in parent
            onDelete(editableData._id);
        }
    };
    
    // Rest of the component remains the same...
    if (!isOpen) {
        return null;
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose} // onClose is memoized in parent
            maxWidth="md"
            title={editableData._id ? "Edit Job Application" : "Add Job Application"}
        >
            <div className="p-4 space-y-4">
                {/* Company */}
                <div>
                    <InputBox id="company" label="Company *" name="company" type="text" value={editableData.company} onChange={handleChange} placeholder="Company Name" required />
                </div>
                {/* Role */}
                <div>
                    <InputBox id="role" name="role" label="Role *" type="text" value={editableData.role} onChange={handleChange} placeholder="Job Title / Position" required />
                </div>
                
             
                <div className="flex items-center justify-between gap-4">
                    {/* Status */}
                    <div className="w-1/2">
                        <InputBox id="status" label="Status" name="status" type="select" options={statusOptions} value={editableData.status} onChange={handleChange} className="mt-1 bg-senary" />
                    </div>
                    {/* Applied At */}
                    <div className="w-1/2">
                        <InputBox id="appliedAt" label="Applied Date" name="appliedAt" type="date"
                                  value={editableData.appliedAt} onChange={handleChange} className="mt-1 bg-senary"/>
                    </div>
                </div>
                {/* Notes */}
                <div>
                    <InputBox id="notes" label="Notes" name="notes" textarea={true} value={editableData.notes}
                              onChange={handleChange} placeholder="Add any relevant notes..." rows={4}
                              className="mt-1"/>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end pt-4 space-x-2 border-t border-border">
                    <Button variant="gray" onClick={onClose}>Cancel</Button>
                    {editableData._id && (<Button variant="danger" onClick={handleDelete}>Delete</Button>)}
                    <Button variant="primary"
                            onClick={handleSave}>{editableData._id ? 'Save Changes' : 'Add Job'}</Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditJobsTrackingModal;