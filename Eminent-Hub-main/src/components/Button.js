import React from "react";

const Button = ({
                    children,
                    type = "button",
                    onClick,
                    variant = "primary",
                    className = "",
                    icon: Icon = null,
                }) => {
    const baseClasses =
        "px-4 py-2 md:px-6 md:py-2.5 text-sm rounded-lg flex items-center justify-center  border border-border gap-2 transition focus:outline-none";
    
    const variants = {
        primary:
            "text-white bg-primary hover:bg-primary",
        secondary:
            "text-white bg-secondary hover:bg-secondary",
        success:
            "text-white bg-accent hover:bg-accent",
        danger:
            "text-white bg-danger hover:bg-danger ",
        gray: "text-foreground bg-senary hover:bg-senary",
        light_danger: "bg-red-100 text-color-danger hover:bg-red-200",
        light_primary: "bg-blue-100 text-primary hover:bg-blue-200",
        tertiary: "bg-pink-500 text-white hover:bg-pink-600",
        tertiary_light: "bg-pink-100 text-pink-500 hover:bg-pink-200",
        active: "bg-orange-500 text-white hover:bg-orange-600",
        active_light: "bg-orange-100 text-orange-500 hover:bg-orange-200",
    };
    
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

export default Button;