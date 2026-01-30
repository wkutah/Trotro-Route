"use client";

import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import RoleGuard from '@/components/admin/RoleGuard';

// Mock data for the table
const ROUTES = [
    { id: 1, name: 'Circle - Madina', fare: 15.00, stops: 12, status: 'Active' },
    { id: 2, name: 'Achimota - Accra', fare: 12.50, stops: 8, status: 'Active' },
    { id: 3, name: 'Kaneshie - Mallam', fare: 8.00, stops: 15, status: 'Maintenance' },
    { id: 4, name: 'Spintex - Tetteh Quarshie', fare: 10.00, stops: 6, status: 'Active' },
];

export default function AdminRoutes() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Route Management</h1>
                <RoleGuard allowedRoles={['SUPER_ADMIN', 'EDITOR']}>
                    <Link
                        href="/admin/routes/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Add New Route
                    </Link>
                </RoleGuard>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route Name</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Fare</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stops</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {ROUTES.map((route) => (
                            <tr key={route.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{route.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">GH₵ {route.fare.toFixed(2)}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{route.stops}</td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${route.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {route.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <RoleGuard allowedRoles={['SUPER_ADMIN', 'EDITOR']}>
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                        </RoleGuard>

                                        <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                                            <button className="text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </RoleGuard>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
