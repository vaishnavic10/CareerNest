import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";

const Modal = ({ isOpen, onClose, children, maxWidth = 'lg', extraClass = '', title }) => {
    if (!isOpen) {
        return null;
    }
    
    let maxWidthClass = '';
    switch (maxWidth) {
        case 'sm':
            maxWidthClass = 'max-w-sm';
            break;
        case 'md':
            maxWidthClass = 'max-w-md';
            break;
        case 'lg':
            maxWidthClass = 'max-w-lg';
            break;
        case 'xl':
            maxWidthClass = 'max-w-xl';
            break;
        case '2xl':
            maxWidthClass = 'max-w-2xl';
            break;
        default:
            maxWidthClass = 'max-w-md';
    }
    
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`fixed inset-0 bg-background/65 flex justify-center items-center z-50`} onClick={handleOutsideClick}>
            <div className={`bg-senary/50 backdrop-blur-md rounded-xl border border-border overflow-hidden ${maxWidthClass} ${extraClass} w-full mx-4`}>
                <div className={`p-6 backdrop-blur-2xl`}>
                    <div className="flex justify-between items-center mb-4">
                        {title && <h2 className="text-lg font-semibold">{title}</h2>}
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <CgClose size={20}/>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
