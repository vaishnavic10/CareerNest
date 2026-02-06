import {useState, useCallback, useEffect} from 'react';
import { useAuth } from '@/context/authContext';
import axios from 'axios';

const useUserOperations = () => {
    const { token, user, updateRole } = useAuth(); // Get updateRole from context
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState(null); // State for username
    
    
    const fetchData = useCallback(async (url, method = 'GET', body = null) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                method,
                url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                data: body || undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Request failed');
            return null;
        } finally {
            setLoading(false);
        }
    }, [token]);
    
    const fetchUser = useCallback(async (email) => {
        if (!email) return;
        const data = await fetchData(`/api/user?email=${email}`);
        setUserData(data);
        setUsername(data.username);
        return data;
    }, [fetchData]);
    
    const updateUser = useCallback(async (email, updateData) => {
        if (!email) return;
        return fetchData('/api/user', 'PUT', { email, update: updateData });
    }, [fetchData]);
    
    const switchUserRole = useCallback(async (email) => {
        if (!email) return;
        const response = await fetchData('/api/user/switch-role', 'PUT', { email});
        if (response?.result?.role) {
            updateRole(response.result.role); // Update the role in AuthContext
        }
        return response;
    }, [fetchData, updateRole]); // Include updateRole in dependency array
    
    useEffect(() => {
        if (user?.email) {
            fetchUser(user.email);
        } else {
            setUsername(null);
            setUserData(null);
        }
    }, [user?.email, fetchUser]);
    
    return {
        loading,
        error,
        userData,
        fetchUser,
        updateUser,
        switchUserRole,
        username,
    };
};

export default useUserOperations;