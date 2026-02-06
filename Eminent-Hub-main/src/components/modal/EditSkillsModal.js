"use client";

import React, { useState, useEffect } from 'react';
import Modal from "@/components/Modal.js";
import InputBox from "@/components/Input";
import Button from "@/components/Button.js";
import { IoIosClose } from "react-icons/io";

const EditSkillsModal = ({ isOpen, onClose, data, onSave, onDelete }) => {
    const [editableData, setEditableData] = useState({
        category: '',
        items: [],
        newItem: '',
        ...(data || {}),
    });
    
    useEffect(() => {
        if (isOpen) {
            setEditableData({
                category: '',
                items: [],
                newItem: '',
                ...(data || {}),
            });
        }
    }, [isOpen, data]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddItem = () => {
        if (editableData.newItem && !editableData.items.includes(editableData.newItem.trim())) {
            setEditableData(prev => ({
                ...prev,
                items: [...prev.items, editableData.newItem.trim()],
                newItem: '',
            }));
        }
    };
    
    const handleRemoveItem = (itemToRemove) => {
        setEditableData(prev => ({
            ...prev,
            items: prev.items.filter(item => item !== itemToRemove),
        }));
    };
    
    const handleSave = () => {
        onSave(editableData);
        onClose();
    };
    
    const handleDelete = () => {
        if (onDelete && data) {
            onDelete(editableData.category);
        }
        onClose();
    };
    
    if (!isOpen) {
        return null;
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={data ? `Edit "${data.category}" Skills` : 'Add Skill Category'}>
            <div className="p-4 space-y-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category Name</label>
                    <InputBox
                        id="category"
                        name="category"
                        type="text"
                        value={editableData.category || ''}
                        onChange={handleChange}
                        placeholder="e.g., Programming Languages, Frontend Technologies"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="items" className="block text-sm font-medium text-gray-700 mb-1">
                        Skills in this Category
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {editableData.items.map((item) => (
                            <span key={item} className="bg-senary border border-border rounded-xl px-2 py-0.5 text-sm flex items-center">
                                {item}
                                
                                    <IoIosClose className=" text-danger cursor-pointer" size={20} onClick={() => handleRemoveItem(item)} />
                                
                            </span>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <InputBox
                            type="text"
                            value={editableData.newItem || ''}
                            onChange={(e) => setEditableData(prev => ({ ...prev, newItem: e.target.value }))}
                            placeholder="Add Skill"
                            className="flex-grow mt-1"
                        />
                        <Button type="button" onClick={handleAddItem} variant="secondary" size="sm">
                            Add
                        </Button>
                    </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="gray" onClick={onClose}>
                        Cancel
                    </Button>
                    {data && (
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

export default EditSkillsModal;