"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext"; // Assuming you have your AuthContext
import Modal from "@/components/Modal"; // Import the Modal component
import Pagination from "@/components/dashboard/Pagination"; // Import the Pagination component
import Button from "@/components/Button";
import InputBox from "@/components/Input.js"; // Import your Button component
import { toast } from 'react-hot-toast'; // Import toast

export default function AdminContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage, setMessagesPerPage] = useState(10);
    const { token } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    
    useEffect(() => {
        const fetchContactMessages = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/api/contact/admin', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.error || `HTTP error! status: ${response.status}`);
                    toast.error(errorData.error || "Failed to fetch contact messages.");
                } else {
                    const data = await response.json();
                    // Access the array within the "allMessages" object
                    setMessages(data.allMessages || []);
                }
            } catch (e) {
                console.error("Error fetching contact messages:", e);
                setError("Failed to fetch contact messages.");
                toast.error("Failed to fetch contact messages.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchContactMessages();
    }, [token]);
    
    const handleRowClick = (message) => {
        setSelectedMessage(message);
        setIsPopupVisible(true);
    };
    
    const closePopup = () => {
        setIsPopupVisible(false);
        setSelectedMessage(null);
        setDeleteError(null); // Clear any previous delete errors
    };
    
    const handleMessagesPerPageChange = (e) => {
        setMessagesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    
    const handleDelete = async () => {
        if (!selectedMessage?._id) {
            return;
        }
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            const response = await fetch(`/api/contact/admin?id=${selectedMessage._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || "Contact message deleted successfully!");
                // Remove the deleted message from the local state
                setMessages(prevMessages => prevMessages.filter(msg => msg._id !== selectedMessage._id));
                closePopup(); // Close the modal after successful deletion
            } else {
                const errorData = await response.json();
                console.error("Error deleting message:", errorData.error);
                setDeleteError(errorData.error || "Failed to delete message.");
                toast.error(errorData.error || "Failed to delete message.");
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            setDeleteError("Failed to connect to the server to delete the message.");
            toast.error("Failed to connect to the server to delete the message.");
        } finally {
            setIsDeleting(false);
        }
    };
    
    const filteredMessages = messages.filter(message => {
        const searchMatch =
            search === "" ||
            message.name.toLowerCase().includes(search.toLowerCase()) ||
            message.email.toLowerCase().includes(search.toLowerCase());
        
        const messageDate = new Date(message.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        let dateMatch = true;
        if (dateFilter === "today") {
            dateMatch = messageDate >= today && messageDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        } else if (dateFilter === "yesterday") {
            dateMatch = messageDate >= yesterday && messageDate < today;
        } else if (dateFilter === "week") {
            dateMatch = messageDate >= startOfWeek && messageDate < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
        } else if (dateFilter === "month") {
            dateMatch = messageDate >= startOfMonth && messageDate < new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1);
        } else if (dateFilter === "custom" && startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateMatch = messageDate >= start && messageDate <= end;
        }
        
        return searchMatch && dateMatch;
    });
    
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    if (loading) {
        return <div className="text-center text-gray-500">Loading contact messages...</div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }
    
    return (
        <div className="pb-10 h-full px-4 bg-background rounded-lg flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact Messages
            </h2>
            
            <div className="flex justify-between items-center mb-4">
                <InputBox
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex items-center">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="p-2 border border-border bg-senary rounded mb-2 sm:mb-0 sm:mr-2 flex-grow text-foreground"
                    >
                        <option value="all">All</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom</option>
                    </select>
                    {dateFilter === "custom" && (
                        <div className="flex flex-col sm:flex-row flex-wrap">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-2 border border-border rounded mb-2 sm:mb-0 sm:mr-2 flex-grow text-foreground bg-background"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-2 border border-border rounded mb-2 sm:mb-0 sm:mr-2 flex-grow text-foreground bg-background"
                            />
                        </div>
                    )}
                    <select
                        value={messagesPerPage}
                        onChange={handleMessagesPerPageChange}
                        className="border border-border p-2 rounded-md text-foreground bg-background"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            </div>
            {currentMessages && currentMessages.length > 0 ? (
                <ul className="space-y-2">
                    {currentMessages.map(message => (
                        <li key={message._id}
                            className="mb-2 p-3 border border-border rounded shadow-md bg-senary text-foreground cursor-pointer"
                            onClick={() => handleRowClick(message)}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <h3 className="text-md font-semibold">{message.name}</h3>
                                    <p className="text-sm opacity-70">{message.email}</p>
                                </div>
                                <p className="text-sm opacity-60">
                                    {new Date(message.createdAt).toLocaleDateString()} -{' '}
                                    {new Date(message.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-foreground opacity-70">No contact messages found.</p>
            )}
            
            <Pagination
                currentPage={currentPage}
                onPageChange={paginate}
                totalItems={filteredMessages.length}
                itemsPerPage={messagesPerPage}
            />
            
            <Modal isOpen={isPopupVisible} onClose={closePopup} maxWidth="md" title={"Message Details"}>
                {selectedMessage && (
                    <div className=" space-y-4 text-foreground">
                        <h2 className="text-lg font-semibold">{selectedMessage.name}</h2>
                        <p className="text-xs text-gray-500 mb-2">{selectedMessage.email}</p>
                        <p className="text-sm">{selectedMessage.message}</p>
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                            {deleteError && <p className="text-red-500 text-xs">{deleteError}</p>}
                            <Button variant="danger" onClick={handleDelete} disabled={isDeleting} className="text-xs sm:text-sm">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}