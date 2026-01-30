import StatsCard from '@/components/admin/StatsCard';
import { Route, Search, AlertCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Routes"
                    value="12"
                    icon={Route}
                    trend="8%"
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
                    value="5"
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
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted By</th>
                            <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="py-4 px-6">
                                <p className="text-sm font-medium text-gray-900">Lapaz ➝ Kasoa</p>
                                <p className="text-xs text-gray-500">New Route</p>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">Kwame Mensah</td>
                            <td className="py-4 px-6">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Review</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-4 px-6">
                                <p className="text-sm font-medium text-gray-900">37 Station ➝ Adentan</p>
                                <p className="text-xs text-gray-500">Fare Update</p>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">Sarah O.</td>
                            <td className="py-4 px-6">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Review</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
