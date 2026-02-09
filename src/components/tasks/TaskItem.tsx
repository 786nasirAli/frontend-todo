"use client";

import { fetchWithAuth } from "@/lib/api";
import { useState, useEffect } from "react";

export default function TaskItem({ task, onToggle }: { task: any, onToggle: () => void }) {
    const [toggling, setToggling] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);

    // Sync editedTitle when task prop changes
    useEffect(() => {
        setEditedTitle(task.title);
    }, [task.title]);

    const handleToggle = async () => {
        setToggling(true);
        try {
            await fetchWithAuth(`/tasks/${task.id}/toggle`, {
                method: "PATCH",
            });
            onToggle();
        } catch (err) {
            console.error("Toggle failed:", err);
        } finally {
            setToggling(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await fetchWithAuth(`/tasks/${task.id}`, {
                method: "DELETE",
            });
            onToggle();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleUpdate = async () => {
        if (!editedTitle.trim()) return;
        try {
            await fetchWithAuth(`/tasks/${task.id}`, {
                method: "PUT",
                body: JSON.stringify({ title: editedTitle }),
            });
            setIsEditing(false);
            onToggle();
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <div className={`p-4 border rounded-xl flex justify-between items-center transition-all duration-200 ${
            task.is_completed ? "bg-gray-50 border-gray-100 opacity-75" : "bg-white border-gray-200 shadow-sm hover:shadow-md"
        }`}>
            <div className="flex items-center gap-3 flex-1">
                <div 
                    onClick={handleToggle}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors flex-shrink-0 ${
                        task.is_completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-500"
                    }`}
                >
                    {task.is_completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                
                {isEditing ? (
                    <input 
                        type="text" 
                        value={editedTitle} 
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                        className="flex-1 p-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        autoFocus
                    />
                ) : (
                    <span className={`font-medium transition-all ${
                        task.is_completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}>
                        {task.title}
                    </span>
                )}
            </div>
            
            <div className="flex gap-2 ml-4">
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-1.5 transition-colors ${isEditing ? "text-blue-600" : "text-gray-400 hover:text-blue-500"}`}
                    title="Edit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                
                <button 
                    onClick={handleDelete}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
