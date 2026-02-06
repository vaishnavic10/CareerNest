"use client";

import React, { useState, useEffect } from "react";
import InputBox from "@/components/Input";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

const UpdateLogFormModal = ({ isOpen, onClose, onSave, initialData, onDelete }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        version: "",
        type: "",
        description: "",
        details: "",
        ...initialData,
    });
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setFormData({
                date: new Date().toISOString().split("T")[0],
                version: "",
                type: "",
                description: "",
                details: initialData?.details?.join("\n") || "",
                ...initialData,
            });
        }
    }, [isOpen, initialData]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            details: formData.details ? formData.details.split("\n").filter((line) => line.trim() !== "") : [],
        };
        onSave(formattedData);
        onClose();
    };
    
    const openDeleteConfirmation = () => {
        setDeleteConfirmationOpen(true);
    };
    
    const closeDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
    };
    
    const handleDeleteConfirm = () => {
        if (onDelete && initialData?._id) {
            onDelete(initialData._id);
            closeDeleteConfirmation();
            onClose();
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={initialData?._id ? "Edit Update Log" : "Add New Update Log"}>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <InputBox id="description" type="text" name="description" value={formData.description}
                              onChange={handleChange} required className="mt-1"/>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <InputBox id="date" type="date" name="date" value={formData.date} onChange={handleChange} required
                              className="mt-1"/>
                </div>
                
                <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type
                        </label>
                        <InputBox id="type" type="text" name="type" value={formData.type} onChange={handleChange}
                                  required
                                  placeholder="e.g., Feature, Bug Fix, Improvement" className="mt-1"/>
                    </div>
                    <div>
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                            Version
                        </label>
                        <InputBox id="version" type="text" name="version" value={formData.version}
                                  onChange={handleChange}
                                  required className="mt-1"/>
                    </div>
                
                </div>
                
                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                        Details
                    </label>
                    <textarea
                        id="details"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none p-2"
                        placeholder="Enter each detail on a new line..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each point on a new line. It will be formatted as bullet points.</p>
                
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="gray" onClick={onClose}>
                    Cancel
                    </Button>
                    {initialData?._id && (
                        <Button variant="danger" onClick={openDeleteConfirmation}>
                            Delete
                        </Button>
                    )}
                    <Button type="submit" variant="primary">{initialData ? "Save" : "Add"}</Button>
                </div>
            </form>
            
            {deleteConfirmationOpen && (
                <Modal isOpen={deleteConfirmationOpen} onClose={closeDeleteConfirmation} maxWidth="sm"
                       title="Confirm Delete">
                    <div className="p-4">
                        <p className="mb-4">Are you sure you want to delete this update log?</p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="gray" onClick={closeDeleteConfirmation}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </Modal>
    );
};

export default UpdateLogFormModal;
