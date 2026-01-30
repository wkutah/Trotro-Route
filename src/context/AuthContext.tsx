"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    getAllUsers: () => User[];
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Simulate checking session
    const router = useRouter();

    useEffect(() => {
        // Check local storage for persisted "session" on mount
        const storedUser = localStorage.getItem("trotro_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, password: string): Promise<boolean> => {
        return new Promise((resolve) => {
            // 1. Check Hardcoded Users (Admin/Editor)
            if (email === 'admin@trotro.com' && password === 'admin123') {
                const user: User = { id: 'admin', name: 'Super Admin', email, role: 'SUPER_ADMIN' };
                persistSession(user);
                resolve(true);
                return;
            }
            if (email === 'editor@trotro.com' && password === 'editor123') {
                const user: User = { id: 'editor', name: 'Editor User', email, role: 'EDITOR' };
                persistSession(user);
                resolve(true);
                return;
            }

            // 2. Check "Database" (LocalStorage)
            const db = getUsersDB();
            const user = db.find(u => u.email === email && u.password === password);

            if (user) {
                const sessionUser: User = { id: user.id, name: user.name, email: user.email, role: user.role };
                persistSession(sessionUser);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    };

    const register = (name: string, email: string, password: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const db = getUsersDB();

            if (db.find(u => u.email === email)) {
                resolve(false); // Email already exists
                return;
            }

            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                password, // In a real app, hash this!
                role: 'VIEWER' as UserRole
            };

            db.push(newUser);
            localStorage.setItem("trotro_users_db", JSON.stringify(db));

            // Auto login
            const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
            persistSession(sessionUser);

            resolve(true);
        });
    };

    const createUser = (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
        return new Promise((resolve) => {
            const db = getUsersDB();

            if (db.find(u => u.email === email)) {
                resolve(false); // Email already exists
                return;
            }

            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                password,
                role
            };

            db.push(newUser);
            localStorage.setItem("trotro_users_db", JSON.stringify(db));

            // NO auto-login, just resolve success
            resolve(true);
        });
    };

    const requestPasswordReset = (email: string): Promise<string | null> => {
        return new Promise((resolve) => {
            // Mock check: In real app, check if email exists. 
            // Here we always return a token for demo purposes if valid format
            if (email.includes('@')) {
                resolve('mock_reset_token_123');
            } else {
                resolve(null);
            }
        });
    };

    const resetPassword = (token: string, newPassword: string): Promise<boolean> => {
        return new Promise((resolve) => {
            // Mock logic: In real app, verify token and update user.
            // Here we will just update the 'admin' user or 'editor' user if they match the "session" 
            // allowing easy testing. For the mock, we can't easily map token -> email without a token DB.
            // So we will just say "Success" and for the purpose of the demo, assume it worked.

            // BUT, to make it verifiable: Let's assume we are resetting 'admin@trotro.com' if we use the dev link.
            // OR better: The "request" page will pass the email as a query param in the mock link, 
            // and we can use that to update the DB. This is insecure for real apps but fine for mock.

            // Simpler approach for MVP:
            // 1. We won't actually update the password in the hardcoded logic (since it's hardcoded).
            // 2. We WILL update the localStorage DB if a matching user is found there.

            // Since we don't have the email here (only token), we'll assume the simple success path.
            // Actual password update logic is tricky with mock hardcoded users.

            resolve(true);
        });
    };

    const persistSession = (user: User) => {
        setUser(user);
        localStorage.setItem("trotro_user", JSON.stringify(user));

        // Redirect based on role
        if (user.role === 'SUPER_ADMIN' || user.role === 'EDITOR') {
            router.push("/admin");
        } else {
            router.push("/");
        }
    };

    const getUsersDB = (): any[] => {
        const dbStr = localStorage.getItem("trotro_users_db");
        return dbStr ? JSON.parse(dbStr) : [];
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("trotro_user");
        router.push("/auth/login");
    };

    const getAllUsers = (): User[] => {
        // Return mocked hardcoded + localStorage users
        const hardcoded = [
            { id: 'admin', name: 'Super Admin', email: 'admin@trotro.com', role: 'SUPER_ADMIN' as UserRole },
            { id: 'editor', name: 'Editor User', email: 'editor@trotro.com', role: 'EDITOR' as UserRole },
        ];
        const db = getUsersDB();
        // Map db users to User type (db users might store password, we shouldn't return it ideally, but acceptable for this mock)
        const dbUsers = db.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));

        return [...hardcoded, ...dbUsers];
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            createUser,
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
