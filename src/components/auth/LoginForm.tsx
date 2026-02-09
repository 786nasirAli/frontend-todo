"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        console.log("Starting Google Sign In...");
        
        try {
            const result = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
            
            console.log("Sign in result:", result);
            
            if (result?.error) {
                console.error("Sign in error:", result.error);
                setError(result.error.message || "Google Sign In failed");
            }
        } catch (err: any) {
            console.error("Google Sign In catch block:", err);
            setError("Google Sign In failed to redirect. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            if (isSignUp) {
                const { data, error: signUpError } = await authClient.signUp.email({
                    email,
                    password,
                    name: email.split("@")[0],
                });
                if (signUpError) {
                    setError(signUpError.message || "Sign up failed");
                    setLoading(false);
                    return;
                }
            } else {
                const { data, error: signInError } = await authClient.signIn.email({
                    email,
                    password,
                });
                if (signInError) {
                    setError(signInError.message || "Login failed");
                    setLoading(false);
                    return;
                }
            }
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Auth Error:", err);
            setError("Authentication failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center font-medium">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                    disabled={loading}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    className={`w-full p-3 text-white rounded-lg font-bold shadow-sm transition ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={loading}
                >
                    {loading ? "Processing..." : isSignUp ? "Create Account" : "Login"}
                </button>
            </form>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg font-semibold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
            >
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M19.6 10.23c0-.82-.07-1.42-.25-2.05H10v3.86h5.5c-.15.96-.82 2.38-2.25 3.3l3.21 2.48c1.88-1.73 2.96-4.28 2.96-7.59z" fill="#4285F4"/>
                    <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.21-2.48c-.88.61-2.03.98-3.41.98-2.62 0-4.84-1.77-5.64-4.15l-3.31 2.56C3.01 18.1 6.26 20 10 20z" fill="#34A853"/>
                    <path d="M4.36 11.93c-.23-.68-.36-1.41-.36-2.18s.13-1.5.36-2.18L1.05 5.01C.38 6.3 0 7.77 0 9.75s.38 3.45 1.05 4.74l3.31-2.56z" fill="#FBBC05"/>
                    <path d="M10 3.94c1.84 0 3.11.79 3.82 1.45l2.86-2.8C14.95 1.05 12.7 0 10 0 6.26 0 3.01 1.9 1.05 5.01l3.31 2.56c.8-2.38 3.02-4.15 5.64-4.15z" fill="#EA4335"/>
                </svg>
                Continue with Google
            </button>

            <p className="text-center text-sm text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-600 font-semibold hover:underline"
                    disabled={loading}
                >
                    {isSignUp ? "Go to Login" : "Register here"}
                </button>
            </p>
        </div>
    );
}