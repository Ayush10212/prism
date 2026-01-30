"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    user: any;
    token: string | null;
    login: (userData: any, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("prism_token");
        const savedUser = localStorage.getItem("prism_user");
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData: any, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("prism_token", token);
        localStorage.setItem("prism_user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("prism_token");
        localStorage.removeItem("prism_user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
