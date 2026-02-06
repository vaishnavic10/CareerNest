"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import { Geist } from "next/font/google"; // Import Geist here if needed

const ThemeContext = createContext();

// Define geistSans here at the top level of the module
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

// Define geistMono here as well if you intend to use it
const geistMono = Geist({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('white'); // Default theme
    
    useEffect(() => {
        // Load theme from localStorage or system preference
        const storedTheme = localStorage.getItem('theme');
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (storedTheme) {
            setTheme(storedTheme);
        } else if (prefersDarkMode) {
            setTheme('dark-blue'); // Default dark theme
        }
    }, []); // Run once on mount
    
    useEffect(() => {
        // Save theme to localStorage whenever it changes
        localStorage.setItem('theme', theme);
        // Apply theme class to body
        if (typeof window !== 'undefined') {
            document.body.className = `antialiased no-scrollbar ${geistSans.variable} ${geistMono.variable}`; // Reset base classes
            if (theme !== 'white') {
                document.body.classList.add(`${theme}-theme`);
            }
        }
    }, [theme]); // Run when theme changes
    
    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };
    
    const value = {
        theme,
        toggleTheme,
    };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);