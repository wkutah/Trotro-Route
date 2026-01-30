import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className={`mt-4 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {trendUp ? '↑' : '↓'} {trend}
                    <span className="text-gray-400 font-normal ml-2">vs last month</span>
                </div>
            )}
        </div>
    );
}
