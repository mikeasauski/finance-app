"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CreditCard,
    ArrowLeftRight,
    Settings,
    Menu,
    X,
    Wallet,
    Plus,
    Calendar,
    BarChart,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import TransactionForm from "@/components/forms/TransactionForm";
import { useUser } from "@/contexts/UserContext";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Sidebar() {
    const { user, logout } = useUser();
    const { t } = useLanguage();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const navItems = [
        { name: t("dashboard"), href: "/", icon: LayoutDashboard },
        { name: t("transactions"), href: "/transactions", icon: ArrowLeftRight },
        { name: t("wallet"), href: "/cards", icon: CreditCard },
        { name: t("calendar"), href: "/calendar", icon: Calendar },
        { name: t("reports"), href: "/reports", icon: BarChart },
        { name: t("planning"), href: "/planning", icon: Target },
        { name: t("income"), href: "/income", icon: Wallet },
        { name: t("settings"), href: "/settings", icon: Settings },
    ];

    return (
        <>
            <aside className={cn(
                "hidden md:flex flex-col sticky top-0 h-screen z-40 bg-white border-r border-border transition-all duration-300 ease-in-out flex-shrink-0",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <div className="p-4 flex flex-col h-full">
                    {/* Header with Toggle */}
                    <div className={cn("flex items-center mb-8", isCollapsed ? "justify-center" : "justify-between px-2")}>
                        {!isCollapsed && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                    F
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">Finance.ai</h1>
                            </div>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            {isCollapsed ? <Menu size={20} /> : <ArrowLeftRight size={20} className="rotate-180" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 flex-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <item.icon size={20} />
                                    {!isCollapsed && <span>{item.name}</span>}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / User */}
                    <div className="mt-auto space-y-4">
                        <button
                            onClick={() => setIsTransactionModalOpen(true)}
                            className={cn(
                                "flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors shadow-sm",
                                isCollapsed ? "w-10 h-10 p-0 mx-auto" : "w-full px-4 py-2"
                            )}
                        >
                            <Plus size={20} />
                            {!isCollapsed && <span>{t('new_transaction')}</span>}
                        </button>

                        <div className={cn("pt-4 border-t border-border", isCollapsed && "flex justify-center")}>
                            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                                {user?.photo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name || t('user')}</p>
                                        <button
                                            onClick={logout}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                        >
                                            {t('logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Transaction Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
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
