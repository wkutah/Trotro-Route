"use client";

import { MOCK_ROUTES } from "@/data/routes";
import { Bus, Clock, Coins, MapPin, ArrowRight } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

import { useState, useEffect } from "react";

export default function RoutesPage() {
    const [routes, setRoutes] = useState(Object.values(MOCK_ROUTES));

    useEffect(() => {
        // Load combined routes (Mock + Approved)
        const approved = JSON.parse(localStorage.getItem('trotro_approved_routes') || '[]');

        const formattedApproved = approved.map((r: any) => ({
            id: r.id,
            totalFare: r.fare,
            totalDuration: 'Unknown',
            steps: [
                {
                    from: { id: 'start', name: r.from, coords: [0, 0] },
                    to: { id: 'end', name: r.to, coords: [0, 0] },
                    fare: r.fare,
                    duration: 'N/A',
                    description: r.notes || 'Direct Route'
                }
            ]
        }));

        setRoutes([...Object.values(MOCK_ROUTES), ...formattedApproved]);
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Available Routes
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Browse our comprehensive list of verified trotro routes across Accra.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {routes.map((route) => (
                            <div key={route.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <Bus size={24} />
                                        </div>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            Active
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            {/* We can infer display names from the steps for now since route doesn't have a name property directly */}
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                                                {route.steps[0].from.name} <span className="text-gray-400 mx-1">→</span> {route.steps[route.steps.length - 1].to.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Coins size={16} />
                                                <span className="font-medium text-gray-900">GH₵ {route.totalFare.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} />
                                                <span>{route.totalDuration}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-600">
                                                <strong className="text-gray-900">{route.steps.length}</strong> Transfer(s) involved via {route.steps[0].to.name === route.steps[route.steps.length - 1].to.name ? "Direct" : route.steps[0].to.name}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                    <button className="w-full text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors flex items-center justify-center gap-2 group">
                                        View Full Details
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
