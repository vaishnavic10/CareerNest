// CustomTextEditor.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    FaBold, FaItalic, FaUnderline, FaImage, FaAlignLeft, FaAlignCenter,
    FaAlignRight, FaAlignJustify, FaUndo, FaRedo, FaCode, FaStrikethrough,
    FaSuperscript, FaSubscript, FaListOl, FaListUl, FaEraser, FaTrash,
} from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa6";

// --- Highlight.js Setup ---
// Import core and specific languages for syntax highlighting
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml'; // For HTML
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import plaintext from 'highlight.js/lib/languages/plaintext';

// Import a highlight.js theme
import 'highlight.js/styles/atom-one-dark.css'; // Example theme

// Register the imported languages with highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('html', xml); // Use xml for html
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('plaintext', plaintext);

// --- DOM / Selection Utility Functions ---
// These functions are defined outside the component for potentially broader use
// and to keep the component body cleaner.

/**
 * Saves the current selection's start and end offsets relative to the container node.
 * Returns null if selection is outside the container or doesn't exist.
 */
function saveSelection(containerNode) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !containerNode || !containerNode.contains(selection.anchorNode)) {
        return null;
    }
    const range = selection.getRangeAt(0);
    let start = 0;
    let end = 0;
    
    // Create a range covering text from the start of the container to the selection start
    const preSelectionRange = document.createRange();
    preSelectionRange.selectNodeContents(containerNode);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    start = preSelectionRange.toString().length; // Character offset
    
    // Extend the range to cover up to the selection end
    preSelectionRange.setEnd(range.endContainer, range.endOffset);
    end = preSelectionRange.toString().length; // Character offset
    
    return { start, end };
}

/**
 * Restores a selection within the container node based on saved character offsets.
 * Iterates through text nodes to find the correct positions.
 */
function restoreSelection(containerNode, savedSel) {
    if (!savedSel || !containerNode) return;
    
    const range = document.createRange();
    range.collapse(true); // Start with a collapsed range
    
    let charIndex = 0;
    const nodeStack = [containerNode]; // Use a stack for depth-first traversal
    let startSet = false;
    let node;
    
    // Iterate through nodes to find the start and end positions
    while ((node = nodeStack.shift()) && (!startSet || charIndex < savedSel.end)) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nextCharIndex = charIndex + node.textContent.length;
            // Set start point if within this text node
            if (!startSet && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex);
                startSet = true;
            }
            // Set end point if within this text node (and start is already set)
            if (startSet && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex);
                break; // Found both start and end
            }
            charIndex = nextCharIndex;
        } else {
            // Add child nodes to the stack for processing (in reverse order for stack behavior)
            const children = Array.from(node.childNodes);
            nodeStack.unshift(...children);
        }
    }
    
    // Apply the restored range to the window selection
    const selection = window.getSelection();
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
}


/**
 * Sets the cursor position within an element.
 * Supports 'start', 'end', a specific character offset, or after a specific node.
 */
function setCursorPosition(el, pos = 'end') {
    if (!el) return;
    // Ensure the element is focused before manipulating selection
    if (document.activeElement !== el && typeof el.focus === 'function') {
        el.focus({ preventScroll: true }); // preventScroll helps avoid unwanted jumps
    }
    
    const range = document.createRange();
    const selection = window.getSelection();
    
    if (pos === 'end') {
        range.selectNodeContents(el); // Select everything
        range.collapse(false); // Collapse to the end
    } else if (pos === 'start') {
        range.selectNodeContents(el); // Select everything
        range.collapse(true); // Collapse to the start
    } else if (typeof pos === 'number') {
        // Traverse text nodes to find the correct character offset
        let charCount = 0;
        let found = false;
        function traverseNodes(node) {
            if (found) return;
            if (node.nodeType === Node.TEXT_NODE) {
                const nextCharCount = charCount + node.length;
                if (pos >= charCount && pos <= nextCharCount) {
                    range.setStart(node, pos - charCount);
                    range.collapse(true); // Collapse to the calculated position
                    found = true;
                }
                charCount = nextCharCount;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    traverseNodes(node.childNodes[i]);
                    if (found) return;
                }
            }
        }
        traverseNodes(el);
        // Fallback if position wasn't found (e.g., offset > length)
        if (!found) {
            range.selectNodeContents(el);
            range.collapse(false);
        }
    } else if (pos instanceof Node) {
        // Set cursor right after the specified node
        try {
            range.setStartAfter(pos);
            range.collapse(true);
        } catch (e) { // Fallback if setting after node fails
            console.warn("Could not set cursor after node:", pos, e);
            range.selectNodeContents(el);
            range.collapse(false);
        }
    } else {
        // Default fallback: end of the element
        range.selectNodeContents(el);
        range.collapse(false);
    }
    
    // Apply the new range
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
}


/**
 * Debounce function to limit the rate at which a function can fire.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Finds the nearest ancestor block-level element (P, H1-6, PRE, BLOCKQUOTE, LI, DIV with block display)
 * starting from the given node, up to the editor boundary.
 */
function getBlockParent(node, editorNode) {
    if (!node || node === editorNode) return null;
    // Start check from the node itself if it's an element, or its parent if it's text
    let checkNode = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
    while (checkNode && checkNode !== editorNode) {
        const nodeName = checkNode.nodeName;
        // Check common block tags first
        if (['PRE', 'BLOCKQUOTE', 'LI', 'P'].includes(nodeName) || nodeName.match(/^H[1-6]$/)) {
            return checkNode;
        }
        // Check computed style for DIVs or others that might be block
        if (nodeName === 'DIV') {
            const display = window.getComputedStyle(checkNode).display;
            if (display === 'block' || display.includes('list-item')) {
                return checkNode;
            }
        }
        checkNode = checkNode.parentNode;
    }
    return null; // No suitable block parent found
}

/**
 * Finds the enclosing PRE block element, if any, walking up from the given node.
 */
function findEnclosingPreBlock(node, editorNode) {
    let checkNode = node;
    while (checkNode && checkNode !== editorNode) {
        if (checkNode.nodeName === 'PRE') {
            return checkNode;
        }
        checkNode = checkNode.parentNode;
    }
    return null; // Not inside a PRE block
}

// --- React Component Definition ---
export default function CustomTextEditor({ value, onChange }) {
    
    // --- State and Refs ---
    const editorRef = useRef(null); // Ref for the contentEditable div
    const highlightTimeoutRef = useRef(null); // Ref for potential highlight timeout management (though debouncedHighlight handles it now)
    const [selectedLanguage, setSelectedLanguage] = useState("javascript"); // State for the code block language dropdown
    const [blockFormat, setBlockFormat] = useState("p"); // State reflecting the current block format (e.g., 'p', 'h1', 'blockquote')
    const [isCodeBlockActive, setIsCodeBlockActive] = useState(false); // State indicating if the cursor is inside a code block
    
    // --- Syntax Highlighting Logic ---
    /**
     * Applies highlight.js syntax highlighting to a specific code element.
     * Uses save/restore selection to maintain cursor position during re-highlighting.
     */
    const highlightSyntaxInBlock = useCallback((codeElement) => {
        if (!codeElement) return;
        // Prevent re-highlighting if already done (might be needed with complex interactions)
        // codeElement.removeAttribute('data-highlighted');
        
        const savedSel = saveSelection(codeElement.parentNode); // Save relative to PRE for better stability
        const textContent = codeElement.textContent; // Get current plain text
        codeElement.textContent = textContent; // Reset innerHTML to plain text before highlighting
        
        try {
            // Ensure language class is present
            if (!codeElement.className.includes('language-')) {
                const lang = findEnclosingPreBlock(codeElement, editorRef.current)?.querySelector('code')?.className.match(/language-(\w+)/)?.[1] || selectedLanguage || 'plaintext';
                codeElement.className = `language-${lang}`;
            }
            hljs.highlightElement(codeElement); // Apply highlighting
        } catch (error) {
            console.error("Highlight.js error:", error);
            // Restore original text content on error to prevent data loss
            codeElement.textContent = textContent;
        }
        
        restoreSelection(codeElement.parentNode, savedSel); // Restore selection relative to PRE
    }, [selectedLanguage]); // Depends on selectedLanguage as a fallback
    
    /**
     * Debounced version of highlightSyntaxInBlock to avoid excessive highlighting on rapid input.
     */
    const debouncedHighlight = useCallback(
        debounce((element) => highlightSyntaxInBlock(element), 300), // Debounce time (e.g., 300ms)
        [highlightSyntaxInBlock] // Recreate if highlightSyntaxInBlock changes
    );
    
    // --- Editor State Management & Synchronization ---
    /**
     * Updates the component's state (isCodeBlockActive, blockFormat, selectedLanguage)
     * based on the current cursor position or selection within the editor.
     */
    const updateActiveStates = useCallback(() => {
        const selection = window.getSelection();
        if (!editorRef.current || !selection || selection.rangeCount === 0 ||
            !editorRef.current.contains(selection.anchorNode)) {
            // If selection is invalid or outside editor, reset states
            setIsCodeBlockActive(false);
            setBlockFormat('p');
            // Optionally reset selectedLanguage or keep the last active one
            // setSelectedLanguage('javascript');
            return;
        }
        
        const anchorNode = selection.anchorNode;
        const codeBlock = findEnclosingPreBlock(anchorNode, editorRef.current);
        const isActiveCodeBlock = !!codeBlock;
        setIsCodeBlockActive(isActiveCodeBlock); // Update code block active state
        
        // Update selected language if inside a code block
        let currentLang = selectedLanguage; // Default to current state
        if (isActiveCodeBlock && codeBlock) {
            const codeElement = codeBlock.querySelector('code');
            const langMatch = codeElement?.className?.match(/language-(\w+)/);
            if (langMatch && langMatch[1]) {
                currentLang = langMatch[1];
            }
            // Sync component state if DOM language differs
            if (currentLang !== selectedLanguage) {
                setSelectedLanguage(currentLang);
            }
        }
        
        // Determine and update the current block format state
        const blockParent = getBlockParent(anchorNode, editorRef.current);
        let format = 'p'; // Default to paragraph
        if (blockParent) {
            format = blockParent.tagName.toLowerCase();
            if (format === 'pre') { // Special case for code blocks
                format = 'pre'; // Use 'pre' to represent code block state
            }
        }
        // Only update if the format has actually changed
        const validFormats = ['p', 'h1', 'h2', 'h3', 'blockquote', 'pre', 'li'];
        const newBlockFormat = validFormats.includes(format) ? format : 'p';
        if (newBlockFormat !== blockFormat) {
            setBlockFormat(newBlockFormat);
        }
        
    }, [blockFormat, selectedLanguage]); // Dependencies: component states being updated
    
    /**
     * Effect to run initial highlighting on component mount or when the `value` prop changes externally.
     * It finds all `pre code` blocks and highlights them.
     */
    useEffect(() => {
        if (editorRef.current) {
            // Defer highlighting slightly to ensure DOM is fully ready after potential updates
            setTimeout(() => {
                const codeBlocks = editorRef.current.querySelectorAll('pre code');
                codeBlocks.forEach(block => {
                    const langClass = Array.from(block.classList).find(cls => cls.startsWith('language-'));
                    const lang = langClass ? langClass.replace('language-', '') : null;
                    if (lang && hljs.getLanguage(lang)) {
                        // Check if it needs highlighting (e.g., lacks hljs internal markers)
                        if (!block.dataset.highlighted) {
                            highlightSyntaxInBlock(block);
                        }
                    } else {
                        // Ensure plain text blocks are rendered correctly without hljs classes if needed
                        block.className = 'language-plaintext'; // Standardize plaintext
                        // block.textContent = block.textContent; // Resetting might be needed in some cases
                    }
                });
            }, 0); // Timeout 0 pushes execution after current rendering cycle
        }
    }, [value, highlightSyntaxInBlock]); // Rerun if value or highlighting function changes
    
    
    /**
     * Effect to initialize the editor content or update it when the `value` prop changes.
     * Sets default content if `value` is empty.
     */
    useEffect(() => {
        if (editorRef.current) {
            const currentHTML = editorRef.current.innerHTML;
            // Set initial content if editor is empty or value is explicitly empty/null
            if (!value && currentHTML !== "<p><br></p>") {
                editorRef.current.innerHTML = "<p><br></p>"; // Default empty state
            }
            // Update content if `value` prop differs from current DOM state
            else if (value && currentHTML !== value) {
                editorRef.current.innerHTML = value;
            }
            // Ensure active states are correct after potential content changes
            updateActiveStates();
        }
    }, [value, updateActiveStates]); // Rerun only if `value` prop changes
    
    // --- Core Editor Event Handlers ---
    /**
     * Handles the 'input' event on the contentEditable div.
     * Updates the parent component via `onChange` and triggers state updates/highlighting.
     */
    const handleInput = useCallback(() => {
        if (!editorRef.current) return;
        const currentHtml = editorRef.current.innerHTML;
        
        // Ensure editor doesn't become completely empty, which can break contentEditable behavior
        if (currentHtml === "" || currentHtml === "<br>") {
            editorRef.current.innerHTML = "<p><br></p>";
            setCursorPosition(editorRef.current.firstChild, 'start');
        }
        
        onChange(editorRef.current.innerHTML); // Notify parent of the change
        updateActiveStates(); // Update button/dropdown states based on cursor
        
        // Check if input occurred within a code block and trigger debounced highlighting
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const codeBlock = findEnclosingPreBlock(selection.anchorNode, editorRef.current);
            if (codeBlock) {
                const codeElement = codeBlock.querySelector('code');
                if (codeElement) {
                    debouncedHighlight(codeElement); // Use debounced version here
                }
            }
        }
    }, [onChange, updateActiveStates, debouncedHighlight]); // Dependencies
    
    /**
     * Handles selection changes (click, keyboard navigation) to update active states.
     * Uses setTimeout to ensure the selection has fully updated in the DOM.
     */
    const handleSelectionChange = useCallback(() => {
        // Use setTimeout to defer execution until after the selection has updated
        setTimeout(updateActiveStates, 0);
    }, [updateActiveStates]);
    
    /**
     * Handles keydown events for special behaviors like Enter, Backspace, Tab in specific contexts.
     */
    const handleKeyDown = useCallback((event) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editorRef.current) return;
        
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        const editorNode = editorRef.current;
        
        // --- Enter Key Logic ---
        if (event.key === "Enter") {
            const codeBlock = findEnclosingPreBlock(container, editorNode);
            // Inside a code block: Insert newline, prevent default block splitting
            if (codeBlock && !event.shiftKey) {
                event.preventDefault();
                document.execCommand('insertText', false, '\n');
                const codeElement = codeBlock.querySelector('code');
                if (codeElement) {
                    // Needs highlighting update after newline insertion
                    debouncedHighlight(codeElement);
                }
                // Trigger input handler manually since default was prevented
                handleInput();
                return;
            }
            
            // In specific block types (Blockquote, Headings): Exit block on double Enter at the end of an empty block
            const blockParent = getBlockParent(container, editorNode);
            if (blockParent && (blockParent.tagName === 'BLOCKQUOTE' || blockParent.tagName.match(/^H[1-6]$/))) {
                const isEffectivelyEmpty = !blockParent.textContent.trim() ||
                    (blockParent.childNodes.length === 1 && blockParent.firstChild.nodeName === 'BR');
                
                // Check if cursor is at the very end of the block
                const endRange = document.createRange();
                endRange.selectNodeContents(blockParent);
                endRange.collapse(false); // Collapse to end
                const isAtEnd = range.collapsed && range.compareBoundaryPoints(Range.END_TO_END, endRange) === 0;
                
                if (isEffectivelyEmpty && isAtEnd && !event.shiftKey) {
                    event.preventDefault();
                    const newParagraph = document.createElement('p');
                    newParagraph.innerHTML = '<br>'; // Start with a placeholder break
                    // Insert the new paragraph *after* the current block
                    blockParent.parentNode.insertBefore(newParagraph, blockParent.nextSibling);
                    // Move cursor to the start of the new paragraph
                    setCursorPosition(newParagraph, 'start');
                    // Remove the now-empty blockquote/heading
                    blockParent.parentNode.removeChild(blockParent);
                    handleInput(); // Notify changes
                    return;
                }
            }
            
            // Default Enter behavior (insert paragraph) - needs careful handling with contentEditable
            // Let the browser handle default list item behavior, but trigger input after
            if (blockParent?.tagName === 'LI') {
                setTimeout(handleInput, 0); // Allow default, then update state
                return;
            }
            
            // For other cases, explicitly insert a paragraph to ensure consistent block structure
            // Check if Shift+Enter, allow default line break insertion
            if (!event.shiftKey) {
                event.preventDefault();
                document.execCommand('insertParagraph', false);
                // Sometimes execCommand doesn't create the right structure, ensure <p>
                // This logic might need refinement depending on browser inconsistencies
                handleInput();
                return;
            }
            // Allow default Shift+Enter behavior (insert <br>)
        }
        // --- Backspace Key Logic ---
        else if (event.key === "Backspace") {
            const codeBlock = findEnclosingPreBlock(container, editorNode);
            // At the beginning of an empty code block: Convert to paragraph
            if (codeBlock && range.collapsed) {
                const codeElement = codeBlock.querySelector('code');
                const preRange = document.createRange();
                preRange.selectNodeContents(codeBlock);
                preRange.collapse(true); // Collapse to start of PRE
                // Check if cursor is at the very beginning of the PRE content
                const isAtStart = range.compareBoundaryPoints(Range.START_TO_START, preRange) === 0;
                const codeIsEmpty = !codeElement || !codeElement.textContent.trim();
                
                if (isAtStart && codeIsEmpty) {
                    event.preventDefault();
                    const p = document.createElement('p');
                    p.innerHTML = '<br>'; // Placeholder break
                    codeBlock.parentNode.replaceChild(p, codeBlock);
                    setCursorPosition(p, 'start');
                    handleInput();
                    return;
                }
                // If deleting within code block, trigger highlight update
                if (codeElement) {
                    debouncedHighlight(codeElement);
                }
                // Let default backspace happen, then trigger input
                setTimeout(handleInput, 0);
                return; // Allow default backspace otherwise
            }
            
            // At the beginning of an empty blockquote: Convert to paragraph
            const blockParent = getBlockParent(container, editorNode);
            if (blockParent?.tagName === 'BLOCKQUOTE' && range.collapsed) {
                const blockRange = document.createRange();
                blockRange.selectNodeContents(blockParent);
                blockRange.collapse(true); // Collapse to start of block
                const isAtStart = range.compareBoundaryPoints(Range.START_TO_START, blockRange) === 0;
                const isEffectivelyEmpty = !blockParent.textContent.trim() ||
                    (blockParent.childNodes.length === 1 && blockParent.firstChild.nodeName === 'BR');
                
                if (isAtStart && isEffectivelyEmpty) {
                    event.preventDefault();
                    const p = document.createElement('p');
                    p.innerHTML = '<br>';
                    blockParent.parentNode.replaceChild(p, blockParent);
                    setCursorPosition(p, 'start');
                    handleInput();
                    return;
                }
            }
            // Allow default backspace, but trigger state update afterwards
            setTimeout(handleInput, 0);
            
        }
        // --- Tab Key Logic ---
        else if (event.key === 'Tab' && isCodeBlockActive) {
            event.preventDefault(); // Prevent focus change
            document.execCommand('insertText', false, '\t'); // Insert a tab character
            // Re-highlight after inserting tab
            const codeBlock = findEnclosingPreBlock(container, editorNode);
            if (codeBlock) {
                const codeElement = codeBlock.querySelector('code');
                if (codeElement) {
                    debouncedHighlight(codeElement);
                }
            }
            handleInput(); // Notify change
        }
            // --- General Character Input Logic ---
        // Trigger highlighting on character input within code blocks
        else if (!event.ctrlKey && !event.metaKey && event.key.length === 1) {
            const codeBlock = findEnclosingPreBlock(container, editorNode);
            if (codeBlock) {
                const codeElement = codeBlock.querySelector('code');
                if (codeElement) {
                    // Debounce highlighting for typed characters
                    debouncedHighlight(codeElement);
                }
            }
            // Allow default character input, update state after
            setTimeout(handleInput, 0);
        }
            // --- Other Keys ---
        // For other keys (arrows, delete, etc.), update state after default action
        else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'].includes(event.key)) {
            setTimeout(handleSelectionChange, 0); // Update active states after movement/deletion
        }
        
    }, [isCodeBlockActive, debouncedHighlight, handleInput, handleSelectionChange]); // Dependencies
    
    
    // --- Toolbar Action Handlers ---
    /**
     * Generic function to execute standard rich text commands.
     */
    const formatText = (command, arg = null) => {
        // Ensure focus before executing command for reliability
        editorRef.current?.focus({ preventScroll: true });
        document.execCommand(command, false, arg);
        // Manually trigger input handler to update state and notify parent
        handleInput();
        // Re-focus might be needed after some commands
        // editorRef.current?.focus({ preventScroll: true });
    };
    
    /**
     * Toggles blockquote format using formatBlock.
     */
    const handleBlockquote = () => {
        // Check current format; if blockquote, toggle back to paragraph
        if (blockFormat === 'blockquote') {
            formatText("formatBlock", "p");
        } else {
            formatText("formatBlock", "blockquote");
        }
    };
    
    /**
     * Handles image upload: reads file as Data URL and inserts an img tag.
     * NOTE: This embeds the image directly. For production, upload to a server and insert URL.
     */
    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgHTML = `<img src="${e.target.result}" alt="uploaded image" style="max-width: 100%; height: auto; display: block;" />`;
                // Insert the image HTML at the current cursor position
                formatText('insertHTML', imgHTML);
                // Optionally, add a paragraph after the image for easier typing
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const insertedImage = range.startContainer.previousSibling; // Assuming insertHTML places cursor after
                    if (insertedImage && insertedImage.tagName === 'IMG') {
                        const p = document.createElement('p');
                        p.innerHTML = '<br>';
                        editorRef.current.insertBefore(p, insertedImage.nextSibling);
                        setCursorPosition(p, 'start');
                    }
                }
            };
            reader.readAsDataURL(file);
            // Reset file input to allow uploading the same file again
            event.target.value = null;
        } else if (file) {
            alert("Please select a valid image file.");
        }
    };
    
    /**
     * Handles Undo command.
     */
    const handleUndo = () => formatText("undo");
    
    /**
     * Handles Redo command.
     */
    const handleRedo = () => formatText("redo");
    
    /**
     * Handles block format changes from the dropdown (Paragraph, Headings).
     */
    const handleBlockFormatChange = (e) => {
        const newFormat = e.target.value;
        // Use 'formatBlock' command to apply block-level formatting
        formatText("formatBlock", `<${newFormat}>`);
    };
    
    /**
     * Applies text alignment to the current block(s).
     * Avoids applying alignment to PRE blocks.
     */
    const handleAlignment = (alignment) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editorRef.current) return;
        
        const range = selection.getRangeAt(0);
        // Find the block parent(s) covering the selection
        const startBlock = getBlockParent(range.startContainer, editorRef.current);
        const endBlock = getBlockParent(range.endContainer, editorRef.current);
        
        if (startBlock && endBlock && startBlock !== endBlock) {
            // Selection spans multiple blocks
            let currentBlock = startBlock;
            while (currentBlock) {
                if (currentBlock.tagName !== 'PRE') { // Don't align PRE blocks
                    currentBlock.style.textAlign = alignment;
                }
                if (currentBlock === endBlock) break;
                currentBlock = currentBlock.nextElementSibling;
                // Safety break if we somehow exit the editor bounds
                if (!currentBlock || !editorRef.current.contains(currentBlock)) break;
            }
        } else if (startBlock) {
            // Selection is within a single block
            if (startBlock.tagName !== 'PRE') {
                startBlock.style.textAlign = alignment;
            }
        } else {
            // No block parent found? Apply to editor root? (less common)
            // Could wrap selection in a div and align that, but might be complex.
            console.warn("Could not find block parent for alignment.");
        }
        
        // Trigger state update after DOM manipulation
        handleInput();
        editorRef.current?.focus({ preventScroll: true });
    };
    
    /**
     * Toggles a code block (PRE/CODE structure).
     * Converts current paragraph/selection to a code block or vice-versa.
     */
    const handleCodeBlockToggle = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editorRef.current) return;
        
        const range = selection.getRangeAt(0);
        const anchorNode = selection.anchorNode;
        const currentCodeBlock = findEnclosingPreBlock(anchorNode, editorRef.current);
        
        if (currentCodeBlock) {
            // --- Toggle OFF: Convert code block back to paragraph(s) ---
            const codeElement = currentCodeBlock.querySelector('code');
            const codeContent = codeElement?.textContent || '';
            // Split content by newlines to potentially create multiple paragraphs
            const lines = codeContent.split('\n');
            const fragment = document.createDocumentFragment();
            let firstNewElement = null;
            
            lines.forEach((line, index) => {
                const p = document.createElement('p');
                // Use innerHTML to handle potential HTML entities if needed, or textContent
                p.innerHTML = line.trim() === '' ? '<br>' : line; // Use <br> for empty lines
                fragment.appendChild(p);
                if (index === 0) {
                    firstNewElement = p; // Keep track of the first new element for cursor placement
                }
            });
            
            // Replace the PRE block with the new fragment
            currentCodeBlock.parentNode.replaceChild(fragment, currentCodeBlock);
            // Set cursor at the beginning of the first new paragraph
            if (firstNewElement) {
                setCursorPosition(firstNewElement, 'start');
            }
            
        } else {
            // --- Toggle ON: Convert selection or current block to a code block ---
            const selectedText = range.toString();
            const blockParent = getBlockParent(anchorNode, editorRef.current);
            
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${selectedLanguage}`; // Use current language state
            
            if (selectedText) {
                // Wrap selected text
                code.textContent = selectedText;
                range.deleteContents(); // Remove the original selected text
                range.insertNode(pre); // Insert the new PRE block
                pre.appendChild(code);
                highlightSyntaxInBlock(code); // Highlight the new block
                setCursorPosition(code, 'end'); // Place cursor at the end of the new code
            } else if (blockParent && blockParent !== editorRef.current && blockParent.tagName !== 'BODY') {
                // Wrap the entire content of the current block parent (e.g., P)
                // Use textContent to avoid carrying over unwanted inline styles
                code.textContent = blockParent.textContent || '\n'; // Use newline if empty
                pre.appendChild(code);
                blockParent.parentNode.replaceChild(pre, blockParent); // Replace block with PRE
                highlightSyntaxInBlock(code);
                setCursorPosition(code, 'start'); // Place cursor at the start
            } else {
                // Insert a new empty code block if selection is empty and not in a clear block
                code.innerHTML = '\n'; // Start with a newline for better spacing
                pre.appendChild(code);
                // Try inserting at the current range position
                try {
                    range.insertNode(pre);
                    range.collapse(false); // Collapse range after the inserted node
                } catch (e) {
                    // Fallback: append to editor if insert fails
                    console.warn("Inserting PRE at range failed, appending.", e)
                    editorRef.current.appendChild(pre);
                    // Insert a paragraph after for spacing?
                    const p = document.createElement('p');
                    p.innerHTML = '<br>';
                    editorRef.current.appendChild(p);
                }
                highlightSyntaxInBlock(code);
                setCursorPosition(code, 'start'); // Place cursor at the start
            }
        }
        // Update state and notify parent after toggling
        handleInput();
    };
    
    /**
     * Handles changes in the code language selector dropdown.
     * Updates the language class of the current code block and re-highlights it.
     */
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setSelectedLanguage(newLang); // Update component state
        
        // Find the currently selected code block (if any)
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editorRef.current) return;
        const codeBlock = findEnclosingPreBlock(selection.anchorNode, editorRef.current);
        
        // Update the class and re-highlight if cursor is in a code block
        if (codeBlock) {
            const codeElement = codeBlock.querySelector('code');
            if (codeElement) {
                codeElement.className = `language-${newLang}`; // Set new language class
                highlightSyntaxInBlock(codeElement); // Re-apply highlighting
                handleInput(); // Notify parent/update state
                editorRef.current?.focus({ preventScroll: true }); // Maintain focus
            }
        }
    };
    
    // --- JSX Rendering ---
    return (
        <div className="bg-background text-foreground rounded-lg border border-border shadow-sm"> {/* Added container styling */}
            {/* --- Toolbar --- */}
            <div
                className="toolbar flex flex-wrap items-center gap-2 p-2 bg-muted rounded-t-lg border-b border-border" /* Adjusted styling */
                aria-label="Text Formatting Toolbar"
            >
                {/* Block Format Dropdown */}
                <select
                    value={isCodeBlockActive ? 'pre' : blockFormat} // Reflect 'pre' if inside code block
                    onChange={handleBlockFormatChange}
                    disabled={isCodeBlockActive} // Disable changing block format when inside code
                    className="border border-input bg-background text-foreground rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    title="Block Format"
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="blockquote">Blockquote</option>
                    {/* Show 'Code Block' as selected but disabled when active */}
                    {isCodeBlockActive && <option value="pre" disabled>Code Block</option>}
                </select>
                
                {/* Standard Formatting Buttons */}
                <button type="button" onClick={() => formatText("bold")} className="toolbar-button" title="Bold (Ctrl+B)"><FaBold /></button>
                <button type="button" onClick={() => formatText("italic")} className="toolbar-button" title="Italic (Ctrl+I)"><FaItalic /></button>
                <button type="button" onClick={() => formatText("underline")} className="toolbar-button" title="Underline (Ctrl+U)"><FaUnderline /></button>
                <button type="button" onClick={() => formatText("strikethrough")} className="toolbar-button" title="Strikethrough"><FaStrikethrough /></button>
                <button type="button" onClick={() => formatText("code")} className="toolbar-button" title="Inline Code (Ctrl+E)"><FaCode /></button>
                <button type="button" onClick={handleBlockquote} className={`toolbar-button ${blockFormat === 'blockquote' ? 'active' : ''}`} title="Blockquote"><FaQuoteLeft /></button>
                <button type="button" onClick={() => formatText("insertOrderedList")} className="toolbar-button" title="Ordered List"><FaListOl /></button>
                <button type="button" onClick={() => formatText("insertUnorderedList")} className="toolbar-button" title="Unordered List"><FaListUl /></button>
                
                {/* Code Block Button & Language Selector */}
                <button
                    type="button"
                    onClick={handleCodeBlockToggle}
                    className={`toolbar-button ${isCodeBlockActive ? 'active' : ''}`}
                    title="Code Block"
                >
                    <FaCode />
                </button>
                {isCodeBlockActive && (
                    <select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        className="border border-input bg-background text-foreground rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring ml-1" /* Adjusted styling */
                        title="Code Language"
                    >
                        <option value="plaintext">Plain Text</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="bash">Bash</option>
                        <option value="json">JSON</option>
                        <option value="markdown">Markdown</option>
                        <option value="sql">SQL</option>
                        <option value="typescript">TypeScript</option>
                        {/* Add more languages here */}
                    </select>
                )}
                
                {/* Image Upload */}
                <label className="toolbar-button cursor-pointer" title="Insert Image">
                    <FaImage />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                
                {/* Alignment Buttons */}
                <button type="button" onClick={() => handleAlignment("left")} className="toolbar-button" title="Align Left"><FaAlignLeft /></button>
                <button type="button" onClick={() => handleAlignment("center")} className="toolbar-button" title="Align Center"><FaAlignCenter /></button>
                <button type="button" onClick={() => handleAlignment("right")} className="toolbar-button" title="Align Right"><FaAlignRight /></button>
                <button type="button" onClick={() => handleAlignment("justify")} className="toolbar-button" title="Justify"><FaAlignJustify /></button>
                
                
                {/* Undo/Redo & Clear Formatting */}
                <button type="button" onClick={handleUndo} className="toolbar-button" title="Undo (Ctrl+Z)"><FaUndo /></button>
                <button type="button" onClick={handleRedo} className="toolbar-button" title="Redo (Ctrl+Y)"><FaRedo /></button>
                <button type="button" onClick={() => formatText("removeFormat")} className="toolbar-button" title="Clear Formatting"><FaEraser /></button>
            
            </div> {/* End Toolbar */}
            
            {/* --- Editable Content Area --- */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning={true} // Suppress React warning about managing contentEditable children
                spellCheck={false} // Disable browser spellcheck if desired
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                // Use selectionchange event on the document for broader compatibility, or these for focus-based updates
                onClick={handleSelectionChange} // Update state on click
                onKeyUp={handleSelectionChange} // Update state after key navigation/deletion
                // onFocus={handleSelectionChange} // Update state when editor gains focus
                // onBlur={() => { /* Optionally clear active states on blur */ }}
                className="p-4 min-h-[250px] focus:outline-none prose dark:prose-invert max-w-none custom-text-editor" /* Adjusted padding/styling */
                style={{
                    whiteSpace: 'pre-wrap', // Preserve whitespace and wrap lines
                    wordBreak: 'break-word', // Break long words to prevent overflow
                    fontFamily: 'sans-serif', // Use a default sans-serif, prose styles might override
                    lineHeight: '1.6'
                }}
                role="textbox"
                aria-multiline="true"
                aria-label="Rich Text Editor"
            />
            {/* Simple CSS for toolbar buttons (can be moved to a CSS file) */}
            <style jsx>{`
                .toolbar-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.4rem;
                    border: 1px solid transparent;
                    background-color: transparent;
                    color: hsl(var(--foreground));
                    border-radius: 0.375rem; /* rounded-md */
                    transition: background-color 0.2s, border-color 0.2s;
                }
                .toolbar-button:hover {
                    background-color: hsl(var(--accent));
                    color: hsl(var(--foreground));
                }
                .toolbar-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                 .toolbar-button.active {
                     background-color: hsl(var(--primary) / 0.1); /* Subtle active state */
                     color: hsl(var(--primary));
                     border-color: hsl(var(--primary) / 0.3);
                 }
                /* Target specific elements within the editor for styling */
                .custom-text-editor pre {
                    background-color: #282c34; /* Match atom-one-dark background */
                    color: #abb2bf; /* Match atom-one-dark default text */
                    padding: 1em;
                    border-radius: 0.375rem;
                    overflow-x: auto; /* Allow horizontal scrolling for long lines */
                    white-space: pre; /* Prevent wrapping inside PRE */
                 }
                 .custom-text-editor code {
                     font-family: 'var(--font-geist-mono)', monospace; /* Ensure code font */
                     white-space: inherit; /* Inherit pre's white-space */
                 }
                 .custom-text-editor blockquote {
                     border-left: 4px solid hsl(var(--border));
                     padding-left: 1rem;
                     margin-left: 0;
                     font-style: italic;
                     color: hsl(var(--foreground));
                 }
                  .custom-text-editor img {
                     max-width: 100%;
                     height: auto;
                     display: block; /* Make images block elements */
                     margin-top: 0.5em;
                     margin-bottom: 0.5em;
                     border-radius: 0.25rem; /* Slight rounding */
                  }
             `}</style>
        
        </div> // End Container
    );
}