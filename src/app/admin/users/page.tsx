"use client";

import { useAuth, UserRole } from "@/context/AuthContext";
import { User, Shield, Mail, Calendar, Plus, X, AlertCircle } from 'lucide-react';
import RoleGuard from "@/components/admin/RoleGuard";
import { useState } from "react";

export default function UsersPage() {
    const { getAllUsers, createUser } = useAuth();
    const users = getAllUsers();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState<UserRole>("VIEWER");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const success = await createUser(newName, newEmail, newPassword, newRole);

        if (success) {
            setIsModalOpen(false);
            // Reset form
            setNewName("");
            setNewEmail("");
            setNewPassword("");
            setNewRole("VIEWER");
        } else {
            setError("Failed to create user. Email might already exist.");
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} />
                    Add New User
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Registered Users</h2>
                    <p className="text-sm text-gray-500">View all users with access to the platform.</p>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                            <User size={16} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                                            user.role === 'EDITOR' ? 'bg-indigo-100 text-indigo-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="SUPER_ADMIN">Super Admin</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-70"
                                >
                                    {loading ? "Creating..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
