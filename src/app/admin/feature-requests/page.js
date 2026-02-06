"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext"; // Assuming you have an AuthContext
import Modal from "@/components/Modal"; // Import the Modal component
import Pagination from "@/components/dashboard/Pagination"; // Import the Pagination component
import Button from "@/components/Button";
import InputBox from "@/components/Input.js"; // Import your Button component
import { toast } from 'react-hot-toast'; // Import toast

export default function AdminFeatureRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [requestsPerPage, setRequestsPerPage] = useState(10);
    const { token } = useAuth(); // Assuming your AuthContext provides these
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    
    useEffect(() => {
        const fetchFeatureRequests = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/api/feature-requests/admin', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.error || `HTTP error! status: ${response.status}`);
                } else {
                    const data = await response.json();
                    setRequests(data);
                }
            } catch (e) {
                console.error("Error fetching feature requests:", e);
                setError("Failed to fetch feature requests.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchFeatureRequests();
    }, [token]);
    
    const handleRowClick = (request) => {
        setSelectedRequest(request);
        setIsPopupVisible(true);
        setDeleteError(null); // Clear any previous delete errors
    };
    
    const closePopup = () => {
        setIsPopupVisible(false);
        setSelectedRequest(null);
    };
    
    const handleRequestsPerPageChange = (e) => {
        setRequestsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing requests per page
    };
    
    const handleDelete = async () => {
        if (!selectedRequest?._id) {
            return;
        }
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            const response = await fetch(`/api/feature-requests/admin?id=${selectedRequest._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || "Feature request deleted successfully!");
                // Remove the deleted request from the local state
                setRequests(prevRequests => prevRequests.filter(req => req._id !== selectedRequest._id));
                closePopup(); // Close the modal after successful deletion
            } else {
                const errorData = await response.json();
                console.error("Error deleting request:", errorData.error);
                setDeleteError(errorData.error || "Failed to delete request.");
                toast.error(errorData.error || "Failed to delete request.");
            }
        } catch (error) {
            console.error("Error deleting request:", error);
            setDeleteError("Failed to connect to the server to delete the request.");
            toast.error("Failed to connect to the server to delete the request.");
        } finally {
            setIsDeleting(false);
        }
    };
    
    const filteredRequests = requests.filter(request => {
        return (
            (categoryFilter === "" || request.category === categoryFilter) &&
            (priorityFilter === "" || request.priority === priorityFilter) &&
            (searchQuery === "" || request.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });
    
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    if (loading) {
        return <div className="text-center text-gray-500">Loading feature requests...</div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }
    
    return (
        <div className=" h-full px-4 pb-10 bg-background rounded-lg flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-foreground mb-4">All Feature Requests (Admin)</h1>
            <div className="flex flex-wrap gap-4 mb-4">
                <InputBox
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-border p-2 rounded-md text-foreground bg-background flex-grow min-w-[150px]"
                >
                    <option value="">All Categories</option>
                    {requests
                        .map(request => request.category)
                        .filter((category, index, self) => self.indexOf(category) === index)
                        .map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border border-border p-2 rounded-md text-foreground bg-background flex-grow min-w-[150px]"
                >
                    <option value="">All Priorities</option>
                    {requests
                        .map(request => request.priority)
                        .filter((priority, index, self) => self.indexOf(priority) === index)
                        .map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                </select>
                <select
                    value={requestsPerPage}
                    onChange={handleRequestsPerPageChange}
                    className="border border-border p-2 rounded-md text-foreground bg-background"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>
            {currentRequests.length > 0 ? (
                <ul className="space-y-4">
                    {currentRequests.map(request => (
                        <li
                            key={request._id}
                            className="p-4 border border-border rounded-lg shadow-sm cursor-pointer"
                            onClick={() => handleRowClick(request)}
                        >
                            <strong className="block text-md text-foreground">{request.title}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No feature requests found.</p>
            )}
            
            <Pagination
                currentPage={currentPage}
                onPageChange={paginate}
                totalItems={filteredRequests.length}
                itemsPerPage={requestsPerPage}
            />
            
            <Modal isOpen={isPopupVisible} onClose={closePopup} maxWidth="md" title={"Feature Request Details"}>
                {selectedRequest && (
                    <div className="p-4 space-y-4 text-foreground">
                        <h2 className="text-xl font-bold">{selectedRequest.title}</h2>
                        <p className="text-gray-600"><strong>Submitted by:</strong> {selectedRequest.submittedBy}</p>
                        <p className="text-gray-600"><strong>Created at:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600"><strong>Description:</strong></p>
                        <p className="whitespace-pre-line">{selectedRequest.description}</p>
                        <p className="text-gray-600"><strong>Category:</strong> {selectedRequest.category}</p>
                        <p className="text-gray-600"><strong>Priority:</strong> {selectedRequest.priority}</p>
                        <div className="flex justify-end gap-2 mt-4">
                            {deleteError && <p className="text-red-500">{deleteError}</p>}
                            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                            <Button onClick={closePopup} disabled={isDeleting}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}