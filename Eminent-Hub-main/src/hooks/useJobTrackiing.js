// hooks/useJobOperations.js
import { useState, useCallback } from 'react';
import { useAuth } from "@/context/authContext.js";
import {fetchData} from "@/utils/fetchData.js";

const useJobTracking = () => {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);
    
    // Fetch jobs by user email
    const fetchJobs = useCallback(async (email) => {
        setLoading(true);
        setError(null);
        try {
            const jobEmail = email || user?.email;
            if (!jobEmail) {
                throw new Error('Email is required to fetch jobs.');
            }
            const data = await fetchData(`/api/jobs?email=${encodeURIComponent(jobEmail)}`, 'GET', null, token);
            setJobs(data);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token, user?.email]);
    
    // Add a new job entry
    const addJob = useCallback(async (newJob) => {
        if (!user?.email) {
            setError('Email is required to add a job.');
            return null;
        }
        try {
            const data = await fetchData('/api/jobs/add', 'POST', { email: user.email, ...newJob }, token);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, [token, user?.email]);
    
    // Update a job entry
    const updateJob = useCallback(async (jobId, updatedJob) => {
        if (!user?.email) {
            setError('Email is required to update a job.');
            return null;
        }
        try {
            const data = await fetchData(`/api/jobs/${jobId}`, 'PUT', { email: user.email, ...updatedJob }, token);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, [token, user?.email]);
    
    // Delete a job entry
    const deleteJob = useCallback(async (jobId) => {
        if (!user?.email) {
            setError('Email is required to delete a job.');
            return null;
        }
        try {
            const data = await fetchData(`/api/jobs/${jobId}`, 'DELETE', null, token);
            return data.success;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, [token, user?.email]);
    
    // Update job status (e.g., switch from "Applied" to "Interview", etc.)
    const updateJobStatus = useCallback(async (jobId, newStatus) => {
        if (!user?.email) {
            setError('Email is required to update job status.');
            return null;
        }
        try {
            const data = await fetchData(`/api/jobs/${jobId}`, 'PATCH', { newStatus }, token);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, [token, user?.email]);
    
    return {
        loading,
        error,
        jobs,
        fetchJobs,
        addJob,
        updateJob,
        deleteJob,
        updateJobStatus,
    };
};

export default useJobTracking;

