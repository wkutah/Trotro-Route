"use client";

import Link from 'next/link';
import { LayoutDashboard, Map, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import RoleGuard from './RoleGuard';

export default function Sidebar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Trotro Admin
                </h2>
                <div className="mt-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.role === 'SUPER_ADMIN' ? 'bg-red-500' : user.role === 'EDITOR' ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                    <p className="text-xs font-semibold text-gray-500">{user.role.replace('_', ' ')}</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium">
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>
                <Link href="/admin/routes" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium">
                    <Map size={20} />
                    Routes
                </Link>

                <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium">
                        <Users size={20} />
                        Users
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium">
                        <Settings size={20} />
                        Settings
                    </Link>
                </RoleGuard>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="mb-4 px-4">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full font-medium">
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
