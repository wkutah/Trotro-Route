"use client";

import { useAuth } from "@/context/AuthContext";
import { Bus, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const { resetPassword } = useAuth();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // In a real app, we'd pluck the token from searchParams
        await resetPassword("mock_token", password);

        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <CheckCircle size={32} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset</h1>
                    <p className="text-gray-500 mb-6">
                        Your password has been successfully updated.
                    </p>
                    <Link
                        href="/auth/login"
                        className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        Login with New Password
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-xl text-white">
                        <Bus size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Set New Password</h1>
                <p className="text-gray-500 mb-8 text-center">Create a strong password for your account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
                    >
                        {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
