"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/api";

export default function TaskForm({ onTaskCreated }: { onTaskCreated: () => void }) {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!title.trim()) return;

        try {
            await fetchWithAuth("/tasks/", {
                method: "POST",
                body: JSON.stringify({ title }),
            });
            setTitle("");
            onTaskCreated();
        } catch (err: any) {
            setError(err.message || "Failed to add task");
            console.error(err);
        }
    };

    return (
        <div className="space-y-2">
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="New task..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                    Add
                </button>
            </form>
        </div>
    );
}
