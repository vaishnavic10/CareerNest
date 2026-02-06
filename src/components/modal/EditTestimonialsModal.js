"use client";

import React, { useState, useEffect } from 'react';
import Modal from "@/components/Modal.js";
import InputBox from "@/components/Input";
import Button from "@/components/Button.js";
import useTestimonials from '@/hooks/useTestimonials';
import { toast } from 'react-hot-toast';

const EditTestimonialsModal = ({ isOpen, onClose, data, isNew }) => {
    const { addTestimonial, updateTestimonial, deleteTestimonial, loading, error } = useTestimonials();
    const [editableData, setEditableData] = useState({
        userEmail: '',
        message: '',
        authorName: '',
        authorTitle: '',
        ...data,
    });
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setEditableData({
                userEmail: '',
                message: '',
                authorName: '',
                authorTitle: '',
                ...data,
            });
        }
    }, [isOpen, data]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSave = async () => {
        if (isNew) {
            toast.loading("Adding testimonial...");
            const success = await addTestimonial(editableData);
            toast.dismiss();
            success ? toast.success("Testimonial added successfully!") : toast.error(error || "Failed to add testimonial.");
        } else if (editableData._id) {
            toast.loading("Saving changes...");
            const success = await updateTestimonial(editableData._id, editableData);
            toast.dismiss();
            success ? toast.success("Testimonial updated successfully!") : toast.error(error || "Failed to update testimonial.");
        }
        onClose();
    };
    
    const openDeleteConfirmation = () => setDeleteConfirmationOpen(true);
    const closeDeleteConfirmation = () => setDeleteConfirmationOpen(false);
    
    const handleDeleteConfirm = async () => {
        if (editableData._id) {
            toast.loading("Deleting testimonial...");
            const success = await deleteTestimonial(editableData._id);
            toast.dismiss();
            success ? toast.success("Testimonial deleted successfully!") : toast.error(error || "Failed to delete testimonial.");
        }
        closeDeleteConfirmation();
        onClose();
    };
    
    if (!isOpen) return null;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={isNew ? 'Add New Testimonial' : 'Edit Testimonial'}>
            <div className="p-4 space-y-4">
                <InputBox id="userEmail" name="userEmail" type="email" label="Email" value={editableData.userEmail} onChange={handleChange} placeholder="User Email" required className="mt-1" />
                <InputBox id="message" name="message" textarea value={editableData.message} onChange={handleChange} placeholder="Testimonial Message" rows={3} required className="mt-1" />
                <InputBox id="authorName" name="authorName" type="text" value={editableData.authorName} onChange={handleChange} placeholder="Author Name" required className="mt-1" />
                <InputBox id="authorTitle" name="authorTitle" type="text" value={editableData.authorTitle} onChange={handleChange} placeholder="Author Title" className="mt-1" />
                
                <div className="flex justify-end space-x-2">
                    <Button variant="gray" onClick={onClose} disabled={loading}>Cancel</Button>
                    {!isNew && <Button variant="danger" onClick={openDeleteConfirmation} disabled={loading}>Delete</Button>}
                    <Button variant="primary" onClick={handleSave} disabled={loading}>{isNew ? 'Add' : 'Save'}</Button>
                </div>
            </div>
            
            {deleteConfirmationOpen && (
                <Modal isOpen={deleteConfirmationOpen} onClose={closeDeleteConfirmation} maxWidth="sm" title="Confirm Delete">
                    <div className="p-4">
                        <p className="mb-4">Are you sure you want to delete this testimonial?</p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="gray" onClick={closeDeleteConfirmation} disabled={loading}>Cancel</Button>
                            <Button variant="danger" onClick={handleDeleteConfirm} disabled={loading}>Delete</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </Modal>
    );
};

export default EditTestimonialsModal;