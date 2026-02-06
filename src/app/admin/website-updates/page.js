"use client";
import Button from "@/components/Button";
import { useState, useEffect, useCallback } from "react";
import useWebsiteUpdateLogs from "@/hooks/useWebsiteUpdateLogs";
import UpdateLogFormModal from "@/components/modal/UpdateLogFormModal";
import { useRouter } from "next/navigation";
import Pagination from "@/components/dashboard/Pagination";
import InputBox from "@/components/Input";
import { toast } from 'react-hot-toast';
import useTabTitle from "@/hooks/useTabTitle.js"; // Import toast

const AdminUpdateLogs = () => {
    useTabTitle("Admin - Website Updates");
    const { logs: allLogs, loading, error, getAllUpdates, addUpdate, updateUpdate, deleteUpdate } = useWebsiteUpdateLogs();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage] = useState(5); // You can adjust this value
    
    const fetchUpdates = useCallback(async () => {
        await getAllUpdates();
        setCurrentPage(1); // Reset page on new data
    }, [getAllUpdates]);
    
    useEffect(() => {
        fetchUpdates();
    }, [fetchUpdates]);
    
    const handleAddClick = () => {
        setIsAddModalOpen(true);
        setEditingLog(null);
    };
    
    const handleEditClick = (log) => {
        setEditingLog(log);
        setEditModalOpen(true);
    };
    
    const handleSave = async (logData) => {
        try {
            if (editingLog) {
                const success = await updateUpdate(editingLog._id, logData);
                if (success) {
                    toast.success('Update log saved successfully!');
                    setEditModalOpen(false);
                } else {
                    toast.error('Failed to save update log.');
                }
            } else if (isAddModalOpen) {
                const success = await addUpdate(logData);
                if (success) {
                    toast.success('New update log added successfully!');
                    setIsAddModalOpen(false);
                } else {
                    toast.error('Failed to add new update log.');
                }
            }
        } catch (err) {
            console.error("Error saving update log:", err);
            toast.error('An unexpected error occurred while saving.');
        } finally {
            setEditingLog(null);
            fetchUpdates(); // Refresh the list
        }
    };
    
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };
    
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingLog(null);
    };
    
    const handleDelete = async (id) => {
        try {
            const success = await deleteUpdate(id);
            if (success) {
                toast.success('Update log deleted successfully!');
            } else {
                toast.error('Failed to delete update log.');
            }
        } catch (err) {
            console.error("Error deleting update log:", err);
            toast.error('An unexpected error occurred while deleting.');
        } finally {
            fetchUpdates(); // Refresh the list
        }
    };
    
    const filteredLogs = allLogs?.filter(log =>
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.version.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    
    // Pagination logic
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    return (
        
        <div className="h-full px-4 pb-10 bg-background rounded-lg flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Manage Website Updates</h1>
            <div className="flex justify-between items-center mb-4">
                <Button onClick={handleAddClick}>Add New Update</Button>
                <InputBox
                    type="text"
                    placeholder="Search updates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-1/3"
                />
                <select
                    value={logsPerPage}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setLogsPerPage(Number(e.target.value));
                    }}
                    className="border border-border p-2 rounded-md text-foreground bg-background"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>
            
            {/* Add New Update Modal */}
            <UpdateLogFormModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSave}
                initialData={null}
                onDelete={null} // No direct delete from add modal
            />
            
            {/* Edit Update Modal */}
            {editingLog && (
                <UpdateLogFormModal
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSave}
                    initialData={editingLog}
                    onDelete={handleDelete} // Pass handleDelete function
                />
            )}
            
            {loading ? (
                <p className="text-center text-gray-500">Loading update logs...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error loading update logs: {error}</p>
            ) : currentLogs.length > 0 ? (
                <>
                    <ul>
                        {currentLogs.map(log => (
                            <li key={log._id}
                                className="mb-2 p-4 bg-background rounded-md border border-border cursor-pointer hover:bg-senary transition-colors"
                                onClick={() => handleEditClick(log)}>
                                <h3 className="font-semibold text-foreground">{log.description}</h3>
                                <p className="text-sm text-foreground/70">{new Date(log.date).toLocaleDateString()} - Version: {log.version}</p>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p className="text-foreground mt-4">No update logs available.</p>
            )}
            <div className="mt-4">
                <Pagination
                    itemsPerPage={logsPerPage}
                    totalItems={filteredLogs.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};

export default AdminUpdateLogs;