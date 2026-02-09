"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import TaskForm from "@/components/tasks/TaskForm";
import TaskItem from "@/components/tasks/TaskItem";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [syncing, setSyncing] = useState(false);
    const router = useRouter();

    const checkAuthAndSync = async () => {
        setLoading(true);
        const { data: session, error } = await authClient.getSession();
        
        if (error || !session) {
            console.log("No session found, redirecting to login");
            router.push("/");
            return;
        }

        setUser(session.user);
        console.log("User logged in:", session.user.email);

        // Sync user with backend
        setSyncing(true);
        try {
            await fetchWithAuth("/auth/sync", {
                method: "POST",
                body: JSON.stringify({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    image: session.user.image
                })
            });
            console.log("User synced with backend");
        } catch (err) {
            console.error("User sync failed:", err);
        } finally {
            setSyncing(false);
        }

        await loadTasks();
    };

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await fetchWithAuth("/tasks/");
            setTasks(data);
            console.log("Tasks loaded:", data.length);
        } catch (err) {
            console.error("Failed to load tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthAndSync();
    }, []);

    if (!user) return <div className="p-12 text-center text-gray-500 animate-pulse">Checking authentication...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="flex justify-between items-center mb-10 pb-6 border-b">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Task Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal todos securely.</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border">
                    <div className="text-right">
                        <p className="text-xs font-medium text-gray-400 uppercase">Authenticated as</p>
                        <p className="text-sm font-semibold text-gray-700">{user.email}</p>
                    </div>
                    <button 
                        onClick={async () => {
                            await authClient.signOut();
                            router.push("/");
                        }}
                        className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-md hover:bg-red-50 transition-colors shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Add New Task</h2>
                <TaskForm onTaskCreated={loadTasks} />
            </section>
            
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-700">Your Task List</h2>
                    {syncing && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold animate-pulse uppercase tracking-wider">Syncing User...</span>}
                </div>
                
                <div className="space-y-3">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-50 border border-gray-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                            <p className="text-gray-400 font-medium">No tasks found. Your list is empty!</p>
                            <p className="text-xs text-gray-300 mt-1">Add your first task above to get started.</p>
                        </div>
                    ) : (
                        tasks.map((task: any) => (
                            <TaskItem key={task.id} task={task} onToggle={loadTasks} />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
