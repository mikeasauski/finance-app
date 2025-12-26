"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Plus, Target, User, CreditCard, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import TransactionForm from "@/components/forms/TransactionForm";
import { X } from "lucide-react";

export default function MobileNav() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const navItems = [
        { name: t("dashboard"), href: "/", icon: LayoutDashboard },
        { name: t("transactions"), href: "/transactions", icon: ArrowLeftRight },
        { name: "FAB", href: "#", icon: Plus }, // Placeholder for FAB logic
        { name: t("planning"), href: "/planning", icon: Target },
        { name: "Ferramentas", href: "/tools", icon: Calculator },
        { name: t("settings"), href: "/settings", icon: User },
    ];

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 pb-safe">
                <div className="flex justify-between items-center">
                    {navItems.map((item, index) => {
                        if (item.name === "FAB") {
                            return (
                                <div key={index} className="relative -top-6">
                                    <button
                                        onClick={() => setIsTransactionModalOpen(true)}
                                        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                                    >
                                        <Plus size={28} />
                                    </button>
                                </div>
                            );
                        }

                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 min-w-[64px]",
                                    isActive ? "text-primary" : "text-gray-500"
                                )}
                            >
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Transaction Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-md">
                            <button
                                onClick={() => setIsTransactionModalOpen(false)}
                                className="absolute -top-10 right-0 text-white/70 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <TransactionForm onClose={() => setIsTransactionModalOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
