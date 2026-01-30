"use client";

import { useAuth } from "@/context/AuthContext";
import { Bus, MapPin, FileText, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

function ContributeForm() {
    const { user } = useAuth();
    const searchParams = useSearchParams();

    const [routeName, setRouteName] = useState("");
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [fare, setFare] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const pFrom = searchParams.get('from');
        const pTo = searchParams.get('to');
        if (pFrom) setFromLocation(pFrom);
        if (pTo) setToLocation(pTo);
        if (pFrom && pTo) setRouteName(`${pFrom} - ${pTo}`);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Save to LocalStorage for Admin Review (Mock Backend)
        const newSubmission = {
            id: `sub_${Date.now()}`,
            name: routeName || `${fromLocation} - ${toLocation}`,
            from: fromLocation,
            to: toLocation,
            fare: parseFloat(fare) || 0,
            notes: notes,
            status: 'pending',
            submittedKy: user?.email || 'Anonymous',
            timestamp: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('trotro_pending_submissions') || '[]');
        localStorage.setItem('trotro_pending_submissions', JSON.stringify([newSubmission, ...existing]));

        // Mock success
        setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-4 rounded-full text-green-600">
                            <CheckCircle size={40} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for contributing to the Trotro Route Finder database. Your route <strong>{routeName}</strong> has been sent for review.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setRouteName("");
                            setFromLocation("");
                            setToLocation("");
                            setFare("");
                            setNotes("");
                        }}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        Submit Another Route
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Contribute Route Data
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Help us improve accuracy by submitting new routes or corrections.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Bus size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={routeName}
                                            onChange={(e) => setRouteName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="e.g. Circle - Achimota New Station"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={fromLocation}
                                            onChange={(e) => setFromLocation(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Starting Point"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={toLocation}
                                            onChange={(e) => setToLocation(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Destination"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Fare (GH₵)</label>
                                    <input
                                        type="number"
                                        step="0.10"
                                        required
                                        value={fare}
                                        onChange={(e) => setFare(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                            <FileText size={18} />
                                        </div>
                                        <textarea
                                            rows={4}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Any landmarks, stops, or detailed directions..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Submit Route
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ContributePage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading form...</div>}>
                <ContributeForm />
            </Suspense>
        </ProtectedRoute>
    );
}
