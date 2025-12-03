"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
    name: string;
    photo?: string;
    pin: string;
}

interface UserContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (pin: string) => boolean;
    logout: () => void;
    updateProfile: (profile: UserProfile) => void;
    hasProfile: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("finance_user_profile");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setHasProfile(true);
        } else {
            setHasProfile(false);
        }
        setIsLoading(false);
    }, []);

    const login = (inputPin: string) => {
        if (user && user.pin === inputPin) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const updateProfile = (profile: UserProfile) => {
        setUser(profile);
        setHasProfile(true);
        setIsAuthenticated(true);
        localStorage.setItem("finance_user_profile", JSON.stringify(profile));
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile, hasProfile }}>
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                children
            )}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
