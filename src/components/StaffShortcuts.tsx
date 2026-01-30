"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffShortcuts() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl + Shift + A
            if (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                router.push('/admin');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return null; // This component renders nothing visual
}
