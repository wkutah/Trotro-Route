import { RouteResult as RouteResultType } from '@/data/routes';
import { Clock, Tag, MapPin, ArrowRight, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface Props {
    route: RouteResultType;
    onClose: () => void;
    onStartNavigation: () => void;
}

export default function RouteResult({ route, onClose, onStartNavigation }: Props) {
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'syncing' | 'verified' | 'flagged'>('idle');
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");

    const handleVerify = (status: 'verified' | 'flagged') => {
        setVerificationStatus('syncing');
        // Mock sync delay
        setTimeout(() => {
            setVerificationStatus(status);
        }, 1500);
    };

    const handleNeedsEditClick = () => {
        setShowFeedbackForm(true);
    };

    const handleSubmitFeedback = () => {
        setShowFeedbackForm(false);
        handleVerify('flagged');
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        Recommended Route
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">
                        GH₵ {route.totalFare.toFixed(2)}
                    </h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    ✕
                </button>
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{route.totalDuration}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Tag size={16} />
                    <span>{route.steps.length} Transfers</span>
                </div>
            </div>

            <div className="space-y-6 relative ml-2 mb-8">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200 -z-10"></div>

                {route.steps.map((step, index) => (
                    <div key={index} className="relative pl-8">
                        {/* Dot */}
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>

                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-400 uppercase">Step {index + 1}</span>
                            <p className="font-medium text-gray-900">
                                {step.from.name} <ArrowRight className="inline mx-1 text-gray-400" size={14} /> {step.to.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                {step.description}
                            </p>
                            <div className="mt-1 flex gap-3 text-xs text-gray-500">
                                <span>Fare: GH₵ {step.fare.toFixed(2)}</span>
                                <span>Duration: {step.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow-sm"></div>
                    <p className="font-semibold text-gray-900">Arrive at Destination</p>
                </div>
            </div>

            {/* Verification Section */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Field Tester Verification</h4>

                {verificationStatus === 'idle' && !showFeedbackForm && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleVerify('verified')}
                            className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-xl font-medium border border-green-200 hover:bg-green-100 transition-colors"
                        >
                            <Check size={18} />
                            Accurate
                        </button>
                        <button
                            onClick={handleNeedsEditClick}
                            className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 py-3 rounded-xl font-medium border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                            <AlertTriangle size={18} />
                            Needs Edit
                        </button>
                    </div>
                )}

                {showFeedbackForm && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="What needs to be updated? (e.g. Fare changed to 5.50)"
                            className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 min-h-[80px]"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFeedbackForm(false)}
                                className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={!feedbackText.trim()}
                                className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send Feedback
                            </button>
                        </div>
                    </div>
                )}

                {verificationStatus === 'syncing' && (
                    <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 py-3 rounded-xl border border-blue-100 animate-pulse">
                        <RefreshCw size={18} className="animate-spin" />
                        <span className="font-medium">Syncing to Cloud...</span>
                    </div>
                )}

                {verificationStatus === 'verified' && (
                    <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 py-3 rounded-xl border border-green-200">
                        <Check size={18} />
                        <span className="font-medium">Verified & Synced</span>
                    </div>
                )}

                {verificationStatus === 'flagged' && (
                    <div className="flex items-center justify-center gap-2 text-amber-700 bg-amber-50 py-3 rounded-xl border border-amber-200">
                        <Check size={18} />
                        <span className="font-medium">Feedback Sent</span>
                    </div>
                )}
            </div>

            <button
                onClick={onStartNavigation}
                className="w-full mt-4 bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Start Navigation
            </button>
        </div>
    );
}
