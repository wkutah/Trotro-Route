"use client";

import { useAuth, UserRole } from "@/context/AuthContext";
import { ReactNode } from "react";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: UserRole[];
    fallback?: ReactNode; // Optional content to show if access is denied (instead of null)
}

export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
