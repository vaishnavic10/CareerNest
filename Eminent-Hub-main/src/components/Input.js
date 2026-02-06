"use client";
import '../app/globals.css';

import React, { useRef } from "react";

const InputBox = ({
                      label,
                      icon,
                      type = "text",
                      name,
                      placeholder,
                      value,
                      onChange,
                      required = false,
                      textarea = false,
                      options = [],
                      className,
                      ...rest
                  }) => {
    const inputRef = useRef(null);
    
    const inputIcon = icon || null;
    
    const baseInputClasses = `w-full h-10 py-2 border border-border rounded-lg focus:ring focus:ring-primary focus:outline-none ${
        inputIcon ? "pl-10" : "pl-4"
    }`;
    const combinedClasses =
        type === "date" ? `${baseInputClasses} no-calendar` : baseInputClasses;
    const inputClasses = className ? `${combinedClasses} ${className}` : combinedClasses;
    
    const handleFocus = (e) => {
        if (type === "date" && inputRef.current && inputRef.current.showPicker) {
            inputRef.current.showPicker();
        }
    };
    
    return (
        <div className="flex flex-col space-y-2">
            {label && (
                <label htmlFor={name} className="mb-1 text-sm text-foreground">
                    {label}
                </label>
            )}
            
            <div className="relative">
                {inputIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground">
                        {inputIcon}
                    </div>
                )}
                
                {textarea ? (
                    <textarea
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={`w-full py-2 border no-scrollbar border-border rounded-lg focus:ring focus:ring-primary focus:outline-none ${
                            inputIcon ? "pl-10" : "pl-4"
                        } ${className || ""}`}
                        rows="4"
                        {...rest}
                    />
                ) : type === "checkbox" ? (
                    <div className="flex items-center space-x-2">
                        <input
                            id={name}
                            type="checkbox"
                            name={name}
                            checked={value}
                            onChange={onChange}
                            required={required}
                            className="w-5 h-5 text-primary border-border rounded focus:ring focus:ring-primary"
                            {...rest}
                        />
                        {label && (
                            <label htmlFor={name} className="text-sm text-foreground cursor-pointer">
                                {label}
                            </label>
                        )}
                    </div>
                ) : type === "select" ? (
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={inputClasses}
                        {...rest}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        ref={inputRef}
                        onFocus={handleFocus}
                        id={name}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={inputClasses}
                        {...rest}
                    />
                )}
            </div>
        </div>
    );
};

export default InputBox;