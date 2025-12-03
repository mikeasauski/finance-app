"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = 'pt' | 'en' | 'es' | 'it';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
    pt: {
        "dashboard": "Dashboard",
        "transactions": "Transações",
        "wallet": "Minha Carteira",
        "calendar": "Calendário",
        "reports": "Relatórios",
        "planning": "Planejamento",
        "income": "Renda",
        "settings": "Configurações",
        "welcome": "Bem-vindo de volta!",
        "overview": "Visão Geral",
        // Add more keys as needed
    },
    en: {
        "dashboard": "Dashboard",
        "transactions": "Transactions",
        "wallet": "My Wallet",
        "calendar": "Calendar",
        "reports": "Reports",
        "planning": "Planning",
        "income": "Income",
        "settings": "Settings",
        "welcome": "Welcome back!",
        "overview": "Overview",
    },
    es: {
        "dashboard": "Panel",
        "transactions": "Transacciones",
        "wallet": "Mi Cartera",
        "calendar": "Calendario",
        "reports": "Informes",
        "planning": "Planificación",
        "income": "Ingresos",
        "settings": "Configuración",
        "welcome": "¡Bienvenido de nuevo!",
        "overview": "Visión General",
    },
    it: {
        "dashboard": "Cruscotto",
        "transactions": "Transazioni",
        "wallet": "Il Mio Portafoglio",
        "calendar": "Calendario",
        "reports": "Rapporti",
        "planning": "Pianificazione",
        "income": "Reddito",
        "settings": "Impostazioni",
        "welcome": "Bentornato!",
        "overview": "Panoramica",
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('pt');

    useEffect(() => {
        const storedLocale = localStorage.getItem("finance_locale") as Locale;
        if (storedLocale) {
            setLocale(storedLocale);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem("finance_locale", newLocale);
    };

    const t = (key: string) => {
        return translations[locale][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
