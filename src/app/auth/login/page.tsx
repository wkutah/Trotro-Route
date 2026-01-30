"use client";

import { useAuth } from "@/context/AuthContext";
import { Bus, Lock, Mail, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-xl text-white">
                        <Bus size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Login</h1>
                <p className="text-gray-500 mb-8 text-center">Sign in to manage Trotro routes and data</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="admin@trotro.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex justify-end mb-2">
                            <a href="/auth/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
                    >
                        {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm font-medium text-gray-600 mb-4">
                        Don't have an account? <a href="/auth/register" className="text-blue-600 hover:underline">Sign up</a>
                    </p>
                    <div className="text-xs text-gray-400">
                        <p>Demo Credentials:</p>
                        <p className="mt-1">Super Admin: admin@trotro.com / admin123</p>
                        <p>Editor: editor@trotro.com / editor123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
