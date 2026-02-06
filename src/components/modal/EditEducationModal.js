"use client";

import React, { useState, useEffect } from 'react';
import Modal from "@/components/Modal.js";
import InputBox from "@/components/Input";
import Button from "@/components/Button.js";

const EditEducationModal = ({ isOpen, onClose, data, onSave, onDelete }) => {
    const [editableData, setEditableData] = useState({
        institution: '',
        degree: '',
        major: '',
        minor: '',
        graduationDate: '',
        description: '',
        ...(data || {}),
    });
    
    useEffect(() => {
        if (isOpen) {
            setEditableData({
                institution: '',
                degree: '',
                major: '',
                minor: '',
                graduationDate: '',
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
        onSave(editableData);
        onClose();
    };
    
    const handleDelete = () => {
        if (onDelete && editableData._id) {
            onDelete(editableData._id);
        }
        onClose();
    };
    
    if (!isOpen) return null;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={data?._id ? 'Edit Education' : 'Add Education'}>
            <div className="p-4 space-y-4">
                <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution</label>
                    <InputBox
                        id="institution"
                        name="institution"
                        type="text"
                        value={editableData.institution || ''}
                        onChange={handleChange}
                        placeholder="University/Institution Name"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700">Degree/Certificate</label>
                    <InputBox
                        id="degree"
                        name="degree"
                        type="text"
                        value={editableData.degree || ''}
                        onChange={handleChange}
                        placeholder="e.g., Bachelor of Science"
                        className="mt-1"
                    />
                </div>
                <div className="flex space-x-4 mb-2">
                    <div className="flex-1">
                        <label htmlFor="major" className="block text-sm font-medium text-gray-700">Major (Optional)</label>
                        <InputBox
                            id="major"
                            name="major"
                            type="text"
                            value={editableData.major || ''}
                            onChange={handleChange}
                            placeholder="e.g., Computer Science"
                            className="mt-1"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="minor" className="block text-sm font-medium text-gray-700">Minor (Optional)</label>
                        <InputBox
                            id="minor"
                            name="minor"
                            type="text"
                            value={editableData.minor || ''}
                            onChange={handleChange}
                            placeholder="e.g., Mathematics"
                            className="mt-1"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="graduationDate" className="block text-sm font-medium text-gray-700">Graduation/Completion Date</label>
                    <InputBox
                        id="graduationDate"
                        name="graduationDate"
                        type="date"
                        value={editableData.graduationDate || ''}
                        onChange={handleChange}
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                    <InputBox
                        id="description"
                        name="description"
                        textarea={true}
                        value={editableData.description || ''}
                        onChange={handleChange}
                        placeholder="Relevant coursework, honors, etc."
                        rows={3}
                        className="mt-1"
                    />
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

export default EditEducationModal;