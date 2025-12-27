import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import AuthGuard from "@/components/layout/AuthGuard";
import LayoutContent from "@/components/layout/LayoutContent";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SidebarProvider } from "@/contexts/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Minhas Finanças",
    description: "Gerenciador financeiro pessoal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${inter.className} antialiased bg-gray-50 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300`}>
                <ErrorBoundary>
                    <ToastProvider>
                        <FinanceProvider>
                            <ThemeProvider>
                                <LanguageProvider>
                                    <UserProvider>
                                        <AuthGuard>
                                            <SidebarProvider>
                                                <LayoutContent>
                                                    {children}
                                                </LayoutContent>
                                            </SidebarProvider>
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
