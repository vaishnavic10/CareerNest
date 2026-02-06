import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from "react-syntax-highlighter/src/styles/prism/one-dark.js";

// Function to render a SyntaxHighlighter component
export const renderCodeBlock = (language, code, index) => (
    <SyntaxHighlighter key={`code-${index}`} language={language} style={oneDark}>
        {code.trim()}
    </SyntaxHighlighter>
);

// Function to extract language from <pre><code> block
export const extractLanguageFromHtml = (htmlString) => {
    try {
        const codeTagMatch = htmlString.match(/<code class="language-(\w+)/);
        if (codeTagMatch && codeTagMatch[1]) {
            return codeTagMatch[1];
        }
        return null; // Return null if language is not found
    } catch (error) {
        console.error("Error extracting language:", error);
        return null;
    }
};