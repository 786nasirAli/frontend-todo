import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    let token = "";
    
    // 1. Try to get the token via the JWT plugin's client method
    try {
        // @ts-ignore
        const jwtRes = await authClient.getJWT();
        if (jwtRes && jwtRes.token) {
            token = jwtRes.token;
        }
    } catch (e) {
        // console.warn("Plugin getJWT failed");
    }

    // 2. Fallback: Check localStorage
    if (!token) {
        token = localStorage.getItem("better-auth.session_token") || "";
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as any) || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    } else {
        console.log(`No Bearer token found for ${endpoint}. Relying on httpOnly cookies.`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include", // This ensures cookies (better-auth.session_token) are sent to backend
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`API Error (${response.status}):`, errorData);
        throw new Error(errorData.detail || `API error: ${response.statusText}`);
    }

    return response.json();
}
