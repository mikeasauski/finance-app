"use client";

import { useState } from "react";
import { Menu, X, LogOut, FileText, Settings, CreditCard, Calendar, Wallet } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
    const { user, logout } = useUser();
    const { t } = useLanguage();
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const drawerItems = [
        { name: t("wallet"), href: "/cards", icon: CreditCard },
        { name: t("calendar"), href: "/calendar", icon: Calendar },
        { name: t("income"), href: "/income", icon: Wallet },
        { name: t("reports"), href: "/reports", icon: FileText },
        { name: t("settings"), href: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-40 flex items-center justify-between">
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="p-2 -ml-2 text-gray-700"
                >
                    <Menu size={24} />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xs">
                        F
                    </div>
                    <span className="font-bold text-gray-900">Finance.ai</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                    {user?.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xs">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                </div>
            </header>

            {/* Drawer Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white z-[51] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
                isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-900">Menu</h2>
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-2 -mr-2 text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 bg-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white p-1 shadow-sm">
                            {user?.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{user?.name || "Usuário"}</p>
                            <p className="text-xs text-gray-500">{user?.email || "email@exemplo.com"}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {drawerItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsDrawerOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                        <LogOut size={20} />
                        {t('logout')}
                    </button>
                </div>
            </div>
        </>
    );
}
