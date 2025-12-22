"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

import MobileNav from "@/components/layout/MobileNav";
import MobileHeader from "@/components/layout/MobileHeader";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <div className="flex min-h-screen bg-background transition-colors duration-300">
            <Sidebar />
            <MobileHeader />

            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 w-full max-w-[100vw] overflow-x-hidden">
                {children}
            </main>

            <MobileNav />
        </div>
    );
}
