"use client";

import Sidebar from '@/components/admin/Sidebar';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user && user.role === 'VIEWER') {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role === 'VIEWER') {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <AdminGuard>
                <div className="min-h-screen bg-gray-50">
                    <Sidebar />
                    <main className="ml-64 p-8">
                        {children}
                    </main>
                </div>
            </AdminGuard>
        </ProtectedRoute>
    );
}
