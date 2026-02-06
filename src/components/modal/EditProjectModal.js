import InputBox from "@/components/Input.js";
import Modal from "@/components/Modal.js";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Button from "@/components/Button.js";

const EditProjectModal = ({ isOpen, onClose, data, onSave, onDelete }) => {
    const [editableData, setEditableData] = useState({
            name: '',
            description: '',
            imageUrl: '',
            liveUrl: '',
            githubUrl: '',
            technologies: [],
            newTechnology: '',
            ...(data || {}),
        });
    
    useEffect(() => {
        if (isOpen) {
                setEditableData({
                    name: '',
                    description: '',
                    imageUrl: '',
                    liveUrl: '',
                    githubUrl: '',
                    technologies: [],
                    newTechnology: '',
                    ...(data || {}),
                });
        }
    }, [isOpen, data]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddTechnology = () => {
        if (
            editableData.newTechnology &&
            !editableData.technologies.includes(editableData.newTechnology.trim())
        ) {
            setEditableData(prev => ({
                ...prev,
                technologies: [...prev.technologies, editableData.newTechnology.trim()],
                newTechnology: '',
            }));
        }
    };
    
    const handleRemoveTechnology = (technologyToRemove) => {
        setEditableData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(tech => tech !== technologyToRemove),
        }));
    };
    
    const handleSave = () => {
        const formattedDescription = editableData.description
            .split("\n")
            .map(line => {
                const trimmed = line.trim();
                if (trimmed === "") {
                    return ""; // Leave blank lines blank
                }
                return trimmed.startsWith("•") ? trimmed : `• ${trimmed}`;
            })
            .join("\n");
        
        onSave({ ...editableData, description: formattedDescription });
        onClose();
    };

    
    const handleDelete = () => {
        if (onDelete && editableData._id) {
            onDelete(editableData._id);
        }
        onClose();
    };
    
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={data?._id ? 'Edit Project' : 'Add Project'}>
            <div className="p-4 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <InputBox
                        id="name"
                        name="name"
                        type="text"
                        value={editableData.name || ''}
                        onChange={handleChange}
                        placeholder="Project Name"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <InputBox
                        id="description"
                        name="description"
                        textarea={true}
                        value={editableData.description || ''}
                        onChange={handleChange}
                        placeholder="Enter each project detail on a new line"
                        rows={4}
                        className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Each line will be formatted as a bullet point.
                    </p>
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                    <InputBox
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={editableData.imageUrl || ''}
                        onChange={handleChange}
                        placeholder="URL to project image"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700">Live URL (Optional)</label>
                    <InputBox
                        id="liveUrl"
                        name="liveUrl"
                        type="url"
                        value={editableData.liveUrl || ''}
                        onChange={handleChange}
                        placeholder="URL to live project"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">GitHub URL (Optional)</label>
                    <InputBox
                        id="githubUrl"
                        name="githubUrl"
                        type="url"
                        value={editableData.githubUrl || ''}
                        onChange={handleChange}
                        placeholder="URL to GitHub repository"
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies Used
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {editableData.technologies.map((tech) => (
                            <span key={tech} className="bg-senary border border-border rounded-full px-3 py-1 text-sm flex items-center">
                                {tech}
                                <IoIosClose className="text-danger cursor-pointer" size={20} onClick={() => handleRemoveTechnology(tech)} />
                            </span>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <InputBox
                            type="text"
                            value={editableData.newTechnology || ''}
                            onChange={(e) =>
                                setEditableData(prev => ({ ...prev, newTechnology: e.target.value }))
                            }
                            placeholder="Add Technology"
                            className="flex-grow mt-1"
                        />
                        <Button type="button" onClick={handleAddTechnology} variant="secondary" size="sm">
                            Add
                        </Button>
                    </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="gray" onClick={onClose}>
                        Cancel
                    </Button>
                    {data?._id && (
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditProjectModal;
