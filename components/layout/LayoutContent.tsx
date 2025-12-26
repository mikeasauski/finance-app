"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import MobileHeader from "@/components/layout/MobileHeader";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0 md:pl-64 transition-all duration-300">
                <MobileHeader />
                <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 animate-in fade-in duration-500">
                    {children}
                </main>
                <MobileNav />
            </div>
        </div>
    );
}
