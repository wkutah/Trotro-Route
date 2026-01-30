"use client";

import Link from 'next/link';
import { Bus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Bus size={24} />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Trotro Route Finder
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Home
                        </Link>
                        {user && (
                            <>
                                <Link href="/routes" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    Routes
                                </Link>
                                <Link href="/contribute" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    Contribute
                                </Link>
                                <Link href="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    Admin Dashboard
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    Hello, {user.name.split(' ')[0]}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
