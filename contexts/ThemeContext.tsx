"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useFinance } from "./FinanceContext";

type Theme = 'light' | 'dark' | 'entrepreneur';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const { appContext } = useFinance();

    // Sync Theme with App Context (Personal/Business)
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-context', appContext);
    }, [appContext]);

    useEffect(() => {
        const storedTheme = localStorage.getItem("finance_theme") as Theme;
        if (storedTheme) {
            setTheme(storedTheme);
            applyTheme(storedTheme);
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        root.setAttribute('data-theme', newTheme);
    };

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem("finance_theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
