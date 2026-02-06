import { useState, useCallback } from 'react';
import { useAuth } from "@/context/authContext.js";

const usePortfolio = (initialEmail) => {
    const { token } = useAuth();
    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [portfolioData, setPortfolioData] = useState(null);
    const [error, setError] = useState(null);
    
    const setEmailForPortfolio = useCallback((newEmail) => {
        setEmail(newEmail);
    }, []);
    
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
            // Handle empty response
            const text = await res.text();
            return text ? JSON.parse(text) : {};
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token]);
    const getPortfolio = useCallback(async () => {
        if (!email) {
            setError('Email is required to fetch portfolio.');
            return null;
        }
        const data = await fetchData(`/api/portfolio/${email}`);
        setPortfolioData(data);
        return data;
    }, [email, fetchData]);
    
    const addProject = useCallback(async (newProject) => {
        if (!email) {
            setError('Email is required to add project.');
            return null;
        }
        return fetchData(`/api/portfolio/projects/add`, 'POST', { email, ...newProject });
    }, [email, fetchData]);
    
    const updateProject = useCallback(async (projectId, updatedProject) => {
        if (!email) {
            setError('Email is required to update project.');
            return null;
        }
        return fetchData(`/api/portfolio/projects/${projectId}`, 'PUT', { email, ...updatedProject });
    }, [email, fetchData]);
    
    const deleteProject = useCallback(async (projectId) => {
        if (!email) {
            setError('Email is required to delete project.');
            return null;
        }
        return fetchData(`/api/portfolio/projects/${projectId}`, 'DELETE', { email });
    }, [email, fetchData]);
    
    const addSkillCategory = useCallback(async (newCategory) => {
        if (!email) {
            setError('Email is required to add skill category.');
            return null;
        }
        return fetchData(`/api/portfolio/skills/category/add`, 'POST', { email, ...newCategory });
    }, [email, fetchData]);
    
    const deleteSkillCategory = useCallback(async (categoryName) => {
        if (!email) {
            setError('Email is required to delete skill category.');
            return null;
        }
        return fetchData(`/api/portfolio/skills/category/${categoryName}`, 'DELETE', { email });
    }, [email, fetchData]);
    
    const addSkillToCategory = useCallback(async (categoryName, newSkill) => {
        if (!email) {
            setError('Email is required to add skill.');
            return null;
        }
        return fetchData(`/api/portfolio/skills/${categoryName}/add`, 'POST', { email, newSkill });
    }, [email, fetchData]);
    
    const deleteSkillFromCategory = useCallback(async (categoryName, skillToRemove) => {
        if (!email) {
            setError('Email is required to delete skill.');
            return null;
        }
        return fetchData(`/api/portfolio/skills/${categoryName}/${skillToRemove}`, 'DELETE', { email });
    }, [email, fetchData]);
    
    const updateSkillCategoryData = useCallback(async (categoryName, updatedCategory) => {
        if (!email) {
            setError('Email is required to update skill category.');
            return null;
        }
        return fetchData(`/api/portfolio/skills/${categoryName}/update`, 'PUT', { email, ...updatedCategory });
    }, [email, fetchData]);
    
    const addEducation = useCallback(async (newEducation) => {
        if (!email) {
            setError('Email is required to add education.');
            return null;
        }
        return fetchData(`/api/portfolio/education/add`, 'POST', { email, ...newEducation });
    }, [email, fetchData]);
    
    const updateEducation = useCallback(async (educationId, updatedEducation) => {
        if (!email) {
            setError('Email is required to update education.');
            return null;
        }
        return fetchData(`/api/portfolio/education/${educationId}`, 'PUT', { email, ...updatedEducation });
    }, [email, fetchData]);
    
    const deleteEducation = useCallback(async (educationId) => {
        if (!email) {
            setError('Email is required to delete education.');
            return null;
        }
        return fetchData(`/api/portfolio/education/${educationId}`, 'DELETE', { email });
    }, [email, fetchData]);
    
    const addExperience = useCallback(async (newExperience) => {
        if (!email) {
            setError('Email is required to add experience.');
            return null;
        }
        return fetchData(`/api/portfolio/experience/add`, 'POST', { email, ...newExperience });
    }, [email, fetchData]);
    
    const updateExperience = useCallback(async (experienceId, updatedExperience) => {
        if (!email) {
            setError('Email is required to update experience.');
            return null;
        }
        return fetchData(`/api/portfolio/experience/${experienceId}`, 'PUT', { email, ...updatedExperience });
    }, [email, fetchData]);
    
    const deleteExperience = useCallback(async (experienceId) => {
        if (!email) {
            setError('Email is required to delete experience.');
            return null;
        }
        return fetchData(`/api/portfolio/experience/${experienceId}`, 'DELETE', { email });
    }, [email, fetchData]);
    
    const updatePersonal = useCallback(async (updateData) => {
        if (!email) {
            setError('Email is required to update personal info.');
            return null;
        }
        return fetchData(`/api/portfolio/personal/${email}`, 'PUT', { email, ...updateData });
    }, [email, fetchData]);
    
    return {
        email,
        setEmail: setEmailForPortfolio,
        loading,
        error,
        portfolioData: portfolioData,
        getPortfolio,
        addProject,
        updateProject,
        deleteProject,
        addSkillCategory,
        deleteSkillCategory,
        addSkillToCategory,
        deleteSkillFromCategory,
        updateSkillCategory: updateSkillCategoryData,
        addEducation,
        updateEducation,
        deleteEducation,
        addExperience,
        updateExperience,
        deleteExperience,
        updatePersonal,
    };
};

export default usePortfolio;