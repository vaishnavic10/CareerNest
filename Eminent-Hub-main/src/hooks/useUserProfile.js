// hooks/useUserProfile.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

function useUserProfile(username) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/mydata/${username}`);
                console.log("Fetched user profile:", response.data);
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError(err);
                setUserData({}); // Set to an empty object to indicate failure but avoid null errors
                setLoading(false);
            }
        };
        
        if (username) {
            fetchUserProfile();
        } else {
            setLoading(false);
            setUserData({}); // Or null, depending on desired default state
        }
    }, [username]);
    
    return { userData, loading, error };
}

export default useUserProfile;