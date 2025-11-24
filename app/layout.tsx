import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { FinanceProvider } from "@/contexts/FinanceContext";

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
            <body className={cn(inter.className, "bg-gray-50 flex min-h-screen")}>
                <FinanceProvider>
                    <Sidebar />
                    <main className="flex-1 p-8 overflow-y-auto">
                        {children}
                    </main>
                </FinanceProvider>
            </body>
        </html>
    );
}
