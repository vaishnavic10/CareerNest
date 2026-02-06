"use client";
import React, { useState, useEffect } from 'react';
import Modal from "@/components/Modal.js";
import InputBox from "@/components/Input.js";
import Button from "@/components/Button.js";
import { toast } from 'react-hot-toast';
import {IoIosClose} from "react-icons/io";

const SOCIAL_NETWORKS = ["Twitter", "LinkedIn", "Github", "Instagram"];

const EditPersonalModal = ({ isOpen, onClose, data, onSave }) => {
    const [editableData, setEditableData] = useState({
        title: '',
        bio: '',
        location: '',  // New field: Location
        phone: '',     // New field: Phone Number
        socialLinks: [],
        ...(data || {})
    });
    
    useEffect(() => {
        setEditableData({
            title: '',
            bio: '',
            location: '',  // Reset location
            phone: '',     // Reset phone number
            socialLinks: [],
            ...(data || {})
        });
    }, [data, isOpen]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSocialLinkChange = (index, field, value) => {
        const updatedLinks = editableData.socialLinks.map((link, i) =>
            i === index ? { ...link, [field]: value } : link
        );
        setEditableData(prev => ({ ...prev, socialLinks: updatedLinks }));
    };
    
    const handleAddSocialLink = () => {
        const filledLinks = editableData.socialLinks.filter(link => link.name && link.url);
        if (filledLinks.length < SOCIAL_NETWORKS.length) {
            setEditableData(prev => ({
                ...prev,
                socialLinks: [...(prev.socialLinks || []), { name: '', url: '' }]
            }));
        }
    };
    
    const handleRemoveSocialLink = (index) => {
        setEditableData(prev => ({
            ...prev,
            socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index)
        }));
    };
    
    const handleSave = () => {
        onSave(editableData);
        toast.success('Personal information updated successfully!');
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Edit Personal Information">
            <div className="p-4 space-y-4">
                {/* Title Input */}
                <InputBox
                    id="title"
                    name="title"
                    value={editableData.title || ''}
                    onChange={handleChange}
                    placeholder="Your portfolio title"
                    className="mt-1"
                />
                
                {/* Bio Input */}
                <InputBox
                    id="bio"
                    name="bio"
                    textarea={true}
                    value={editableData.bio || ''}
                    onChange={handleChange}
                    placeholder="A brief description about yourself"
                    rows={4}
                    className="mt-1"
                />
                
                {/* Location Input */}
                <InputBox
                    id="location"
                    name="location"
                    value={editableData.location || ''}
                    onChange={handleChange}
                    placeholder="Location"
                    className="mt-1"
                />
                
                {/* Phone Number Input */}
                <InputBox
                    id="phone"
                    name="phone"
                    value={editableData.phone || ''}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="mt-1"
                />
                
                {/* Social Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Social Links</h3>
                    {editableData.socialLinks && editableData.socialLinks.map((link, index) => {
                        // Exclude networks already selected in other entries
                        const selectedNetworks = editableData.socialLinks
                            .filter((_, i) => i !== index)
                            .map(l => l.name)
                            .filter(Boolean);
                        // Available options for this dropdown
                        const availableOptions = SOCIAL_NETWORKS.filter(network =>
                            network === link.name || !selectedNetworks.includes(network)
                        );
                        
                        return (
                            <div key={index} className="mb-2 flex space-x-2 items-center">
                                <div className="flex-1 flex space-x-2 items-center">
                                    <InputBox
                                        type="select"
                                        name={`socialLinks-${index}-name`}
                                        value={link.name || ''}
                                        onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                                        options={[
                                            { value: '', label: 'Select Network' },
                                            ...availableOptions.map(network => ({
                                                value: network,
                                                label: network
                                            }))
                                        ]}
                                        className="w-1/6 bg-senary text-foreground"
                                    />
                                    <InputBox
                                        type="url"
                                        placeholder="URL"
                                        name={`socialLinks-${index}-url`}
                                        value={link.url || ''}
                                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                        className="w-5/6 bg-senary text-foreground"
                                    />
                               
                                <IoIosClose className=" text-danger cursor-pointer" size={20} onClick={() => handleRemoveSocialLink(index)} />
                                </div>
                            </div>
                        );
                    })}
                    {editableData.socialLinks.filter(link => link.name && link.url).length < SOCIAL_NETWORKS.length && (
                        <Button
                            type="button"
                            onClick={handleAddSocialLink}
                            variant="secondary"
                            size="sm"
                        >
                            Add Link
                        </Button>
                    )}
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="gray" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={JSON.stringify(editableData) === JSON.stringify({ title: '', bio: '', location: '', phone: '', socialLinks: [], ...(data || {}) }) ? 'disabled' : 'primary'}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditPersonalModal;