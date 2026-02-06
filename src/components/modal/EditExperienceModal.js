"use client";

import React, { useState, useEffect } from 'react';
import Modal from "@/components/Modal.js";
import InputBox from "@/components/Input";
import Button from "@/components/Button.js";

const EditExperienceModal = ({ isOpen, onClose, data, onSave, onDelete }) => {
    const [editableData, setEditableData] = useState({
        title: '',
        company: '',
        location: '', // Added location field
        startDate: '',
        endDate: '',
        description: '',
        ...(data || {}),
    });
    
    useEffect(() => {
        if (isOpen) {
            setEditableData({
                title: '',
                company: '',
                location: '', // Reset location
                startDate: '',
                endDate: '',
                description: '',
                ...(data || {}),
            });
        }
    }, [isOpen, data]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSave = () => {
        const formattedDescription = editableData.description
            .split("\n")
            .map(line => {
                const trimmed = line.trim();
                if (trimmed === "") {
                    return ""; // Leave blank lines blank
                }
                return trimmed.startsWith("•") ? trimmed : `• ${trimmed}`;
            })
            .join("\n");
        
        onSave({ ...editableData, description: formattedDescription });
        onClose();
    };
    
    
    
    const handleDelete = () => {
        if (onDelete && editableData._id) {
            onDelete(editableData._id);
        }
        onClose();
    };
    
    if (!isOpen) {
        return null;
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={data?._id ? "Edit Experience" : "Add Experience"}>
            <div className="p-4 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <InputBox
                        id="title"
                        name="title"
                        type="text"
                        value={editableData.title || ''}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                    <InputBox
                        id="company"
                        name="company"
                        type="text"
                        value={editableData.company || ''}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <InputBox
                        id="location"
                        name="location"
                        type="text"
                        value={editableData.location || ''}
                        onChange={handleChange}
                        placeholder="Job Location (e.g., Remote, New York)"
                        className="mt-1"
                    />
                </div>
                <div className="flex space-x-4 mb-2">
                    <div className="flex-1">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <InputBox
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={editableData.startDate || ''}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                        <InputBox
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={editableData.endDate || ''}
                            onChange={handleChange}
                            placeholder="Leave blank if current"
                            className="mt-1"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <InputBox
                        id="description"
                        name="description"
                        textarea={true}
                        value={editableData.description || ''}
                        onChange={handleChange}
                        placeholder="Enter each responsibility/achievement on a new line"
                        rows={4}
                        className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each point on a new line. It will be formatted as bullet points.</p>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="gray" onClick={onClose}>
                        Cancel
                    </Button>
                    {data?._id && (
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditExperienceModal;
