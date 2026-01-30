"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type UserRole = "SUPER_ADMIN" | "EDITOR" | "VIEWER";

interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    createUser: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
    requestPasswordReset: (email: string) => Promise<string | null>;
    resetPassword: (token: string, newPassword: string) => Promise<boolean>;
    logout: () => void;
    getAllUsers: () => Promise<User[]>; // Changed to Promise
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async (userId: string, email: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            // Fallback for new users if trigger hasn't fired yet? 
            // Or maybe trigger failed? Default to viewer.
            return {
                id: userId,
                email,
                name: 'Unknown User',
                role: 'VIEWER' as UserRole
            };
        }

        // Map database role to TS Role
        const roleMap: Record<string, UserRole> = {
            'super_admin': 'SUPER_ADMIN',
            'editor': 'EDITOR',
            'viewer': 'VIEWER'
        };

        return {
            id: userId,
            email,
            name: data.full_name || email.split('@')[0],
            role: (roleMap[data.role] || 'VIEWER') as UserRole
        };
    };

    useEffect(() => {
        // 1. Check active session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await fetchProfile(session.user.id, session.user.email!);
                setUser(profile);
            }
            setIsLoading(false);
        };
        checkSession();

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const profile = await fetchProfile(session.user.id, session.user.email!);
                setUser(profile);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Login failed:", error.message);
            return false;
        }
        return true;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (error) {
            console.error("Registration failed:", error.message);
            return false;
        }
        return true;
    };

    const createUser = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
        // NOTE: Supabase client cannot easily create ANOTHER user without being logged out.
        // Usually creation of other users is done via Service Role (Admin) API backend function.
        // For Client-side 'createUser' (like Admin Panel adding a user), we might need an Edge Function.

        // For MVP: We will simply show an alert saying this requires backend functions.
        // OR: We can use a trick if we had the service_role key, but we only have Anon Key.

        console.warn("Client-side user creation by Admin is restricted in Supabase (requires Admin API).");
        alert("To create a new user with specific roles, please invite them via the Supabase Dashboard > Authentication > Users.");
        return false;
    };

    const requestPasswordReset = async (email: string): Promise<string | null> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) {
            console.error("Reset request failed:", error.message);
            return null;
        }
        return "success";
    };

    const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
        // In Supabase, usually the user clicks link -> lands on page -> session established -> updateUser
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            console.error("Password update failed:", error.message);
            return false;
        }
        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    const getAllUsers = async (): Promise<User[]> => {
        // This requires RLS allowing 'select * from profiles'
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
            console.error("Fetch users failed:", error);
            return [];
        }

        const roleMap: Record<string, UserRole> = {
            'super_admin': 'SUPER_ADMIN',
            'editor': 'EDITOR',
            'viewer': 'VIEWER'
        };

        return data.map((p: any) => ({
            id: p.id,
            name: p.full_name || p.email,
            email: p.email,
            role: (roleMap[p.role] || 'VIEWER') as UserRole
        }));
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            createUser: createUser as any, // Type cast for compatibility
            requestPasswordReset,
            resetPassword,
            logout,
            getAllUsers,
            isAuthenticated: !!user,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

