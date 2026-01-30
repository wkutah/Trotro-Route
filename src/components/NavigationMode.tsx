"use client";

import { RouteResult, RouteStep } from "@/data/routes";
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Navigation } from "lucide-react";
import { useState } from "react";

interface Props {
    route: RouteResult;
    onEndNavigation: () => void;
}

export default function NavigationMode({ route, onEndNavigation }: Props) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const steps = route.steps;
    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onEndNavigation();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    return (
        <div className="bg-white h-full flex flex-col relative z-20">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onEndNavigation}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <span className="font-bold text-lg tracking-wide">NAVIGATION MODE</span>
                    <div className="w-10"></div> {/* Spacer */}
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full animate-pulse">
                        <Navigation size={32} className="transform rotate-45" />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium uppercase">Current Instruction</p>
                        <h2 className="text-2xl font-bold leading-none">Step {currentStepIndex + 1} of {steps.length}</h2>
                    </div>
                </div>
            </div>

            {/* Instruction Card */}
            <div className="flex-grow p-6 flex flex-col justify-center items-center text-center space-y-8 bg-gray-50">
                <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-6 rounded-full text-blue-600">
                            {isLastStep ? <MapPin size={48} /> : <ArrowRight size={48} />}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentStep.description}
                    </h3>

                    <div className="flex items-center justify-center gap-2 text-gray-500 mt-4">
                        <MapPin size={16} />
                        <span>{currentStep.from.name}</span>
                        <ArrowRight size={16} />
                        <span>{currentStep.to.name}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xs">
                    <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold">
                        <span>Start</span>
                        <span>Destination</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                        className="px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-500 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Prev
                    </button>
                    <button
                        onClick={handleNext}
                        className={`flex-grow py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLastStep ? (
                            <>
                                <CheckCircle size={24} />
                                Arrived
                            </>
                        ) : (
                            <>
                                Next Step
                                <ArrowRight size={24} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
