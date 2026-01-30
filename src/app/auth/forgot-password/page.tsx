"use client";

import { useAuth } from "@/context/AuthContext";
import { Bus, Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const { requestPasswordReset } = useAuth();
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const token = await requestPasswordReset(email);

        setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <CheckCircle size={32} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                    <p className="text-gray-500 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 text-sm text-left">
                        <p className="font-bold text-gray-700 mb-2">Dev Helper (Mock Mode)</p>
                        <p className="text-gray-500 mb-3">Since we can't send real emails, click this link to verify:</p>
                        <Link
                            href="/auth/reset-password?token=mock_reset_token_123"
                            className="block w-full bg-gray-900 text-white text-center py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Reset Password
                        </Link>
                    </div>

                    <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                        Back to Login
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

                <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password?</h1>
                <p className="text-gray-500 mb-8 text-center">Enter your email to receive a reset link</p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
                    >
                        {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm font-medium text-gray-600">
                    <Link href="/auth/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
