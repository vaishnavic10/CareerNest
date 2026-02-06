// hooks/useWebsiteUpdateLogs.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/context/authContext";
import {fetchData} from "@/utils/fetchData.js";

const useWebsiteUpdateLogs = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    
    const getAllUpdates = useCallback(async () => {
        const data = await fetchData('/api/website-updates');
        if (data) setLogs(data);
        return data;
    }, []);
    
    const addUpdate = useCallback(async (updateData) => {
        const newLog = await fetchData('/api/website-updates', 'POST', updateData);
        if (newLog) setLogs(prev => [newLog, ...prev]);
        return newLog;
    }, []);
    
    const updateUpdate = useCallback(async (id, updateData) => {
        const updatedLog = await fetchData(`/api/website-updates/${id}`, 'PUT', updateData);
        if (updatedLog) setLogs(prev => prev.map(log => (log._id === id ? updatedLog : log)));
        return updatedLog;
    }, []);
    
    const deleteUpdate = useCallback(async (id) => {
        const success = await fetchData(`/api/website-updates/${id}`, 'DELETE');
        if (success) setLogs(prev => prev.filter(log => log._id !== id));
        return success;
    }, []);
    
    useEffect(() => {
        getAllUpdates();
    }, [getAllUpdates]);
    
    return {
        logs,
        loading,
        error,
        getAllUpdates,
        addUpdate,
        updateUpdate,
        deleteUpdate,
    };
};

export default useWebsiteUpdateLogs;