"use client";

import React, { useState, useEffect } from 'react';
import EditPersonalModal from "@/components/modal/EditPersonalModal.js";
import EditExperienceModal from "@/components/modal/EditExperienceModal.js";
import EditEducationModal from "@/components/modal/EditEducationModal.js";
import EditProjectModal from "@/components/modal/EditProjectModal.js";
import EditSkillsModal from "@/components/modal/EditSkillsModal.js";
import usePortfolio from '@/hooks/usePortfolio';
import { useAuth } from "@/context/authContext.js";
import  useUserOperations  from "@/hooks/useUserOperations.js";
import Button from "@/components/Button.js";
import { toast } from 'react-hot-toast';
import useTabTitle from "@/hooks/useTabTitle.js";

const PortfolioPage = () => {
    useTabTitle("Portfolio");
    const { user } = useAuth();
    const userEmail = user?.email;
    const { userData, fetchUser } = useUserOperations();
    const {
        portfolioData,
        loading,
        error,
        getPortfolio,
        updatePersonal,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        addProject,
        updateProject,
        deleteProject,
        addSkillCategory,
        updateSkillCategory: updateSkillCategoryData,
        deleteSkillCategory,
        addSkillToCategory,
        deleteSkillFromCategory,
    } = usePortfolio(userEmail);
    
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);
    const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] = useState(false);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [editingExperienceData, setEditingExperienceData] = useState(null);
    const [isEditEducationModalOpen, setIsEditEducationModalOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState(null);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isEditSkillsModalOpen, setIsEditSkillsModalOpen] = useState(false);
    const [editingSkillCategory, setEditingSkillCategory] = useState(null);
    
    useEffect(() => {
        if (userEmail) {
            getPortfolio();
            fetchUser(userEmail);
        }
    }, [getPortfolio, fetchUser, userEmail]);
    
    const openEditPersonalModal = () => setIsEditPersonalModalOpen(true);
    const closeEditPersonalModal = () => setIsEditPersonalModalOpen(false);
    
    const handleSavePersonal = async (newData) => {
        const success = await updatePersonal(newData);
        if (success) {
            getPortfolio();
            closeEditPersonalModal();
            toast.success("Personal information updated successfully!");
        } else {
            toast.error("Failed to update personal information.");
        }
    };
    
    const openEditExperienceModal = (index) => {
        setEditingExperienceIndex(index);
        setEditingExperienceData(
            index !== null && portfolioData?.experience
                ? portfolioData.experience[index]
                : { title: '', company: '', startDate: '', endDate: '', description: '' }
        );
        setIsEditExperienceModalOpen(true);
    };
    const closeEditExperienceModal = () => {
        setIsEditExperienceModalOpen(false);
        setEditingExperienceIndex(null);
        setEditingExperienceData(null);
    };
    const handleSaveExperience = async (updatedExperience) => {
        let success;
        if (editingExperienceIndex !== null && editingExperienceIndex >= 0) {
            const experienceId = portfolioData?.experience[editingExperienceIndex]?._id;
            if (experienceId) {
                success = await updateExperience(experienceId, updatedExperience);
                if (success) {
                    toast.success("Experience updated successfully!");
                } else {
                    toast.error("Failed to update experience.");
                }
            }
        } else {
            success = await addExperience(updatedExperience);
            if (success) {
                toast.success("Experience added successfully!");
            } else {
                toast.error("Failed to add experience.");
            }
        }
        if (success) {
            getPortfolio();
            closeEditExperienceModal();
        }
    };
    const handleDeleteExperience = async (experienceId) => {
        const success = await deleteExperience(experienceId);
        if (success) {
            getPortfolio();
            toast.success("Experience deleted successfully!");
        } else {
            toast.error("Failed to delete experience.");
        }
    };
    
    const openEditEducationModal = (education) => {
        setEditingEducation(education || { institution: '', degree: '', major: '', minor: '', graduationDate: '', description: '' });
        setIsEditEducationModalOpen(true);
    };
    const closeEditEducationModal = () => {
        setIsEditEducationModalOpen(false);
        setEditingEducation(null);
    };
    const handleSaveEducation = async (updatedEducation) => {
        if (editingEducation?._id) {
            const success = await updateEducation(editingEducation._id, updatedEducation);
            if (success) {
                getPortfolio();
                closeEditEducationModal();
                toast.success("Education updated successfully!");
            } else {
                toast.error("Failed to update education.");
            }
        } else {
            const success = await addEducation(updatedEducation);
            if (success) {
                getPortfolio();
                closeEditEducationModal();
                toast.success("Education added successfully!");
            } else {
                toast.error("Failed to add education.");
            }
        }
    };
    const handleDeleteEducation = async (educationId) => {
        const success = await deleteEducation(educationId);
        if (success) {
            getPortfolio();
            toast.success("Education deleted successfully!");
        } else {
            toast.error("Failed to delete education.");
        }
    };
    
    const openEditProjectModal = (project) => {
        setEditingProject(project || { name: '', description: '', imageUrl: '', liveUrl: '', githubUrl: '', technologies: [], newTechnology: '' });
        setIsEditProjectModalOpen(true);
    };
    const closeEditProjectModal = () => {
        setIsEditProjectModalOpen(false);
        setEditingProject(null);
    };
    const handleSaveProject = async (updatedProject) => {
        if (editingProject?._id) {
            const success = await updateProject(editingProject._id, updatedProject);
            if (success) {
                getPortfolio();
                closeEditProjectModal();
                toast.success("Project updated successfully!");
            } else {
                toast.error("Failed to update project.");
            }
        } else {
            const success = await addProject(updatedProject);
            if (success) {
                getPortfolio();
                closeEditProjectModal();
                toast.success("Project added successfully!");
            } else {
                toast.error("Failed to add project.");
            }
        }
    };
    const handleDeleteProject = async (projectId) => {
        const success = await deleteProject(projectId);
        if (success) {
            getPortfolio();
            toast.success("Project deleted successfully!");
        } else {
            toast.error("Failed to delete project.");
        }
    };
    
    const openEditSkillsModal = (skillCategory) => {
        setEditingSkillCategory(skillCategory || { category: '', items: [], newItem: '' });
        setIsEditSkillsModalOpen(true);
    };
    const closeEditSkillsModal = () => {
        setIsEditSkillsModalOpen(false);
        setEditingSkillCategory(null);
    };
    const handleSaveSkills = async (updatedSkillCategory) => {
        if (editingSkillCategory?.category) {
            const success = await updateSkillCategoryData(editingSkillCategory.category, updatedSkillCategory);
            if (success) {
                getPortfolio();
                closeEditSkillsModal();
                toast.success("Skill category updated successfully!");
            } else {
                toast.error("Failed to update skill category.");
            }
        } else {
            const success = await addSkillCategory(updatedSkillCategory);
            if (success) {
                getPortfolio();
                closeEditSkillsModal();
                toast.success("Skill category added successfully!");
            } else {
                toast.error("Failed to add skill category.");
            }
        }
    };
    const handleDeleteSkillCategory = async (categoryName) => {
        const success = await deleteSkillCategory(categoryName);
        if (success) {
            getPortfolio();
            toast.success("Skill category deleted successfully!");
        } else {
            toast.error("Failed to delete skill category.");
        }
    };
    const handleDeleteSkillFromCategory = async (categoryName, skillToRemove) => {
        const success = await deleteSkillFromCategory(categoryName, skillToRemove);
        if (success) {
            getPortfolio();
            toast.success(`Skill "${skillToRemove}" removed from "${categoryName}"!`);
        } else {
            toast.error(`Failed to remove skill "${skillToRemove}" from "${categoryName}".`);
        }
    };
    
    const getUserInitials = () => {
        if (user && user.displayName) {
            return user.displayName.slice(0, 2).toUpperCase();
        }
        return "NN";
    };
    
    if (error) return <div>Error loading portfolio: {error}</div>;
    if (!portfolioData) return <div></div>;
    
    return (
        <div className="container min-h-screen mx-auto p-6 mb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">
                    {userData?.displayName} - {portfolioData?.title || 'My Portfolio'}
                </h1>
            </div>
            {/* Tab Navigation */}
            <div className="mb-6 md:hidden">
                <ul className="grid grid-cols-3 gap-2">
                    {['personal', 'experience', 'education', 'project', 'skills', 'contact'].map((tab) => (
                        <li key={tab}>
                            <Button
                                onClick={() => setActiveTab(tab)}
                                variant=""
                                className={`w-full px-4 py-2 text-base rounded-md ${
                                    activeTab === tab ? 'bg-secondary text-white' : ' hover:bg-secondary'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="hidden mb-6 border-b border-border md:block">
                <ul className="flex flex-wrap -mb-px">
                    {['personal', 'experience', 'education', 'project', 'skills', 'contact'].map((tab) => (
                        <li key={tab} className="mr-2">
                            <button
                                onClick={() => setActiveTab(tab)}
                                className={`inline-block p-4 border-b-2 ${
                                    activeTab === tab
                                        ? 'border-secondary text-secondary'
                                        : 'border-border border text-foreground'
                                } rounded-t-lg hover:text-gray-600 hover:border-gray-300`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Personal Section */}
            {activeTab === 'personal' && (
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                        {user.jo ? (
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Profile</span>
                            </div>
                        ) : (
                            <div
                                className="w-24 h-24 rounded-full border border-border bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center font-bold text-3xl cursor-pointer"
                            >
                                {getUserInitials()}
                            </div>
                        )}
                        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-x-4">
                            <div className="w-full md:w-2/3">
                                <h2 className="text-2xl font-semibold mb-2">{portfolioData?.title || 'My Portfolio'}</h2>
                                {portfolioData?.bio ? (
                                    <p className="text-base">{portfolioData.bio}</p>
                                ) : (
                                    <p className="text-lg text-gray-600">
                                        No bio available. Click edit to add your bio.
                                    </p>
                                )}
                            </div>
                            <div className="w-full md:w-1/3 flex flex-col justify-center">
                                {activeTab === 'personal' && (
                                    <Button variant="secondary" className="px-2 py-2" onClick={openEditPersonalModal}>
                                        Edit Personal
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
                    {portfolioData?.socialLinks && portfolioData.socialLinks.length > 0 ? (
                        <ul className="flex flex-wrap gap-4">
                            {portfolioData.socialLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No social links added yet.</p>
                    )}
                </div>
            )}
            
            {/* Experience Section */}
            {activeTab === 'experience' && (
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Experience</h2>
                    <Button variant="secondary" className="px-2 py-2 mb-6" onClick={() => openEditExperienceModal(null)}>
                        Add Experience
                    </Button>
                    {portfolioData?.experience && portfolioData.experience.length > 0 ? (
                        <ul>
                            {portfolioData.experience.map((exp, index) => (
                                <li
                                    key={exp._id}
                                    onClick={() => openEditExperienceModal(index)}
                                    className="cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center px-4 rounded-lg py-2 border-b border-border hover:bg-senary bg-background hover:text-foreground transition-colors"
                                >
                                    <div className="w-full md:w-3/4">
                                        <h3 className="font-semibold">{exp.title} at {exp.company}</h3>
                                        <p className="text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</p>
                                        <p className="mt-1">{exp.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No experience added yet.</p>
                    )}
                </div>
            )}
            
            {/* Education Section */}
            {activeTab === 'education' && (
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">Education</h2>
                    <Button variant="secondary" className="px-2 py-2 mb-6" onClick={() => openEditEducationModal(null)}>
                        Add Education
                    </Button>
                    {portfolioData?.education && portfolioData.education.length > 0 ? (
                        <ul>
                            {portfolioData.education.map((edu) => (
                                <li
                                    key={edu._id}
                                    onClick={() => openEditEducationModal(edu)}
                                    className="cursor-pointer px-4 py-2 rounded-md shadow-sm border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-senary bg-background hover:text-foreground transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground">
                                            {edu.degree} from {edu.institution}
                                        </h3>
                                        <p className="text-sm text-gray-600">{edu.graduationDate}</p>
                                        {edu.major && <p className="text-sm text-foreground">Major: {edu.major}</p>}
                                        {edu.minor && <p className="text-sm text-foreground">Minor: {edu.minor}</p>}
                                        {edu.description && (
                                            <p className="text-sm text-foreground mt-1">{edu.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No education entries added yet.</p>
                    )}
                </div>
            )}
            
            {/* Projects Section */}
            {activeTab === 'project' && (
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Projects</h2>
                    <Button variant="secondary" className="px-2 py-2 mb-6" onClick={() => openEditProjectModal(null)}>
                        Add Project
                    </Button>
                    {portfolioData?.projects && portfolioData.projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {portfolioData.projects.map((project) => (
                                <div
                                    key={project._id}
                                    onClick={() => openEditProjectModal(project)}
                                    className="cursor-pointer hover:bg-senary bg-background hover:text-foreground border border-border p-4 rounded-lg transition-colors flex flex-col"
                                >
                                    {project.imageUrl ? (
                                        <div className="w-full h-32 bg-gray-300 rounded-lg mb-2 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">Project Image</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-600 text-sm mb-2">No image available</div>
                                    )}
                                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                                    <p className="flex-grow">{project.description}</p>
                                    <div className="flex space-x-2 mt-2">
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Live Demo
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No projects added yet.</p>
                    )}
                </div>
            )}
            
            {/* Skills Section */}
            {activeTab === 'skills' && (
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Skills</h2>
                    <Button variant="secondary" className="px-2 py-2 mb-6" onClick={() => openEditSkillsModal(null)}>
                        Add Category
                    </Button>
                    {portfolioData?.skills && portfolioData.skills.length > 0 ? (
                        portfolioData.skills.map((skillCategory) => (
                            <div
                                key={skillCategory.category}
                                onClick={() => openEditSkillsModal(skillCategory)}
                                className="cursor-pointer border-b px-4 py-4 border-border rounded-md relative hover:bg-senary bg-background hover:text-foreground transition-colors"
                            >
                                <div className="flex space-x-4 text-center items-center">
                                    <h3 className="text-lg font-semibold">{skillCategory.category}</h3>
                                    {skillCategory.items && skillCategory.items.length > 0 ? (
                                        <ul className="flex flex-wrap gap-2">
                                            {skillCategory.items.map((skill, index) => (
                                                <li
                                                    key={index}
                                                    className="bg-background border border-border rounded-full px-3 py-1 text-sm flex items-center space-x-1"
                                                >
                                                    <span>{skill}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600 mt-2">No skills added in this category.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No skills categories added yet.</p>
                    )}
                </div>
            )}
            
            {/* Contact Section */}
            {activeTab === 'contact' && (
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Contact</h2>
                    <p className="mb-4">Feel free to reach out!</p>
                    {portfolioData?.contactInfo && Object.keys(portfolioData.contactInfo).length > 0 ? (
                        <ul className="space-y-2">
                            {portfolioData.contactInfo.email && (
                                <li>
                                    Email:{" "}
                                    <a
                                        href={`mailto:${portfolioData.contactInfo.email}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {portfolioData.contactInfo.email}
                                    </a>
                                </li>
                            )}
                            {portfolioData.contactInfo.linkedin && (
                                <li>
                                    LinkedIn:{" "}
                                    <a
                                        href={`https://${portfolioData.contactInfo.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {portfolioData.contactInfo.linkedin.split('/').pop()}
                                    </a>
                                </li>
                            )}
                            {portfolioData.contactInfo.github && (
                                <li>
                                    GitHub:{" "}
                                    <a
                                        href={`https://${portfolioData.contactInfo.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {portfolioData.contactInfo.github.split('/').pop()}
                                    </a>
                                </li>
                            )}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No contact info provided yet.</p>
                    )}
                </div>
            )}
            
            {/* Modals */}
            <EditPersonalModal
                isOpen={isEditPersonalModalOpen}
                onClose={closeEditPersonalModal}
                data={{ bio: portfolioData?.bio, socialLinks: portfolioData?.socialLinks, title: portfolioData?.title, location: portfolioData?.location, phone: portfolioData?.phone }}
                onSave={handleSavePersonal}
            />
            {isEditExperienceModalOpen && (
                <EditExperienceModal
                    isOpen={isEditExperienceModalOpen}
                    onClose={closeEditExperienceModal}
                    data={editingExperienceData}
                    onSave={handleSaveExperience}
                    onDelete={handleDeleteExperience}
                />
            )}
            <EditEducationModal
                isOpen={isEditEducationModalOpen}
                onClose={closeEditEducationModal}
                data={editingEducation}
                onSave={handleSaveEducation}
                onDelete={handleDeleteEducation}
            />
            <EditProjectModal
                isOpen={isEditProjectModalOpen}
                onClose={closeEditProjectModal}
                data={editingProject}
                onSave={handleSaveProject}
                onDelete={handleDeleteProject}
            />
            <EditSkillsModal
                isOpen={isEditSkillsModalOpen}
                onClose={closeEditSkillsModal}
                data={editingSkillCategory}
                onSave={handleSaveSkills}
                onDelete={handleDeleteSkillCategory}
            />
        </div>
    );
};

export default PortfolioPage;
