import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Minhas Finanças",
    description: "Gerenciador financeiro pessoal",
};

import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import AuthGuard from "@/components/layout/AuthGuard";
import LayoutContent from "@/components/layout/LayoutContent";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${inter.className} antialiased bg-gray-50 transition-colors duration-300`}>
                <ErrorBoundary>
                    <ToastProvider>
                        <FinanceProvider>
                            <ThemeProvider>
                                <LanguageProvider>
                                    <UserProvider>
                                        <AuthGuard>
                                            <LayoutContent>
                                                {children}
                                            </LayoutContent>
                                        </AuthGuard>
                                    </UserProvider>
                                </LanguageProvider>
                            </ThemeProvider>
                        </FinanceProvider>
                    </ToastProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
