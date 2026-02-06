import { useState, useCallback } from 'react';
import { useAuth } from "@/context/authContext.js";

const useTestimonials = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [testimonials, setTestimonials] = useState([]);
    const [error, setError] = useState(null);
    
    const fetchData = useCallback(async (url, method = 'GET', body = null) => {
        setLoading(true);
        setError(null);
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const config = {
                method,
                headers,
                body: body ? JSON.stringify(body) : null,
            };
            const res = await fetch(url, config);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.error || `HTTP error! status: ${res.status}`);
            }
            return await res.json();
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token]);
    
    const getAllTestimonials = useCallback(async () => {
        const data = await fetchData('/api/testimonials/all');
        if (data) {
            setTestimonials(data);
        }
    }, [fetchData]);
    
    const addTestimonial = useCallback(async (testimonialData) => {
        return fetchData('/api/testimonials/add', 'POST', { testimonialData });
    }, [fetchData]);
    
    
    const updateTestimonial = useCallback(async (testimonialId, updatedTestimonial) => {
        return fetchData(`/api/testimonials/${testimonialId}`, 'PUT', updatedTestimonial);
    }, [fetchData]);
    
    const deleteTestimonial = useCallback(async (testimonialId) => {
        return fetchData(`/api/testimonials/${testimonialId}`, 'DELETE');
    }, [fetchData]);
    
    const getTestimonialsForUser = useCallback(async (userEmail) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchData(`/api/testimonials/${userEmail}`);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchData]);
    
    return {
        loading,
        error,
        testimonials,
        getAllTestimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        getTestimonialsForUser,
    };
};

export default useTestimonials;