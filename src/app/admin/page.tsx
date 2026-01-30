"use client";

import StatsCard from '@/components/admin/StatsCard';
import { Route, Search, AlertCircle, TrendingUp, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define types for our mock data
interface PendingSubmission {
    id: string;
    name: string;
    from: string;
    to: string;
    fare: number;
    notes: string;
    status: 'pending';
    submittedKy: string;
    timestamp: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRoutes: 12,
        pendingReviews: 0,
    });
    const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);

    useEffect(() => {
        // Load data from LocalStorage
        const submissions = JSON.parse(localStorage.getItem('trotro_pending_submissions') || '[]');
        setPendingSubmissions(submissions);

        // Update stats
        const approved = JSON.parse(localStorage.getItem('trotro_approved_routes') || '[]');
        setStats({
            totalRoutes: 12 + approved.length, // Base + Approved
            pendingReviews: submissions.length
        });
    }, []);

    const handleApprove = (submission: PendingSubmission) => {
        // 1. Remove from Pending
        const newPending = pendingSubmissions.filter(s => s.id !== submission.id);
        setPendingSubmissions(newPending);
        localStorage.setItem('trotro_pending_submissions', JSON.stringify(newPending));

        // 2. Add to Approved (Live)
        const approved = JSON.parse(localStorage.getItem('trotro_approved_routes') || '[]');

        // Generate a route key for the search logic (e.g., "accra-kumasi")
        const routeKey = `${submission.from.toLowerCase().replace(/\s+/g, '')}-${submission.to.toLowerCase().replace(/\s+/g, '')}`;

        const newRoute = {
            ...submission,
            routeKey, // Important for indexing
            status: 'approved',
            approvedAt: new Date().toISOString()
        };

        localStorage.setItem('trotro_approved_routes', JSON.stringify([...approved, newRoute]));

        // Update stats
        setStats(prev => ({
            totalRoutes: prev.totalRoutes + 1,
            pendingReviews: prev.pendingReviews - 1
        }));
    };

    const handleReject = (id: string) => {
        const newPending = pendingSubmissions.filter(s => s.id !== id);
        setPendingSubmissions(newPending);
        localStorage.setItem('trotro_pending_submissions', JSON.stringify(newPending));

        setStats(prev => ({ ...prev, pendingReviews: prev.pendingReviews - 1 }));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Routes"
                    value={stats.totalRoutes.toString()}
                    icon={Route}
                    trend="Live"
                    trendUp={true}
                />
                <StatsCard
                    title="Daily Searches"
                    value="1,284"
                    icon={Search}
                    trend="12%"
                    trendUp={true}
                />
                <StatsCard
                    title="Pending Reviews"
                    value={stats.pendingReviews.toString()}
                    icon={AlertCircle}
                />
                <StatsCard
                    title="Total Contributors"
                    value="48"
                    icon={TrendingUp}
                    trend="2%"
                    trendUp={true}
                />
            </div>

            {/* Recent Activity / Pending Submissions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Recent Route Submissions</h2>
                    <span className="text-sm text-gray-500">{pendingSubmissions.length} pending</span>
                </div>

                {pendingSubmissions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No pending submissions. All caught up! 🎉</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingSubmissions.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="py-4 px-6">
                                        <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                                        <p className="text-xs text-gray-500">{sub.from} ➝ {sub.to}</p>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        Fare: GH₵{sub.fare}<br />
                                        <span className="text-xs italic">"{sub.notes.substring(0, 20)}..."</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        <button
                                            onClick={() => handleApprove(sub)}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            title="Approve"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleReject(sub.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Reject"
                                        >
                                            <X size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
