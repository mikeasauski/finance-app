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
    Target,
    Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";
import TransactionForm from "@/components/forms/TransactionForm";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

import { useSidebar } from "@/contexts/SidebarContext";

export default function Sidebar() {
    const { user, logout } = useUser();
    const { t } = useLanguage();
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const navItems = [
        { name: t("dashboard"), href: "/", icon: LayoutDashboard },
        { name: t("transactions"), href: "/transactions", icon: ArrowLeftRight },
        { name: t("wallet"), href: "/cards", icon: CreditCard },
        { name: t("calendar"), href: "/calendar", icon: Calendar },
        { name: t("reports"), href: "/reports", icon: BarChart },
        { name: t("planning"), href: "/planning", icon: Target },
        { name: t("income"), href: "/income", icon: Wallet },
        { name: "Ferramentas", href: "/tools", icon: Calculator },
        { name: t("settings"), href: "/settings", icon: Settings },
    ];

    return (
        <>
            <aside
                className={cn(
                    "hidden md:flex flex-col fixed left-0 top-0 h-screen bg-sidebar border-r border-border transition-all duration-300 z-40",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        {!isCollapsed && (
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent truncate">
                                Finance
                            </h1>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className={cn(
                                "p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors",
                                isCollapsed && "mx-auto"
                            )}
                        >
                            {isCollapsed ? <Menu size={20} /> : <ArrowLeftRight size={20} className="rotate-180" />}
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="space-y-1 flex-1 overflow-y-auto">
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
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <item.icon size={20} />
                                    {!isCollapsed && <span>{item.name}</span>}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-border shadow-sm">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / User */}
                    <div className="mt-auto space-y-4 pt-4 border-t border-border">
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
                                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || t('user')}</p>
                                    <button
                                        onClick={logout}
                                        className="text-xs text-destructive hover:text-destructive/80 font-medium"
                                    >
                                        {t('logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Transaction Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-md bg-background rounded-2xl shadow-xl border border-border">
                            <button
                                onClick={() => setIsTransactionModalOpen(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
                            >
                                <X size={20} />
                            </button>
                            <TransactionForm onClose={() => setIsTransactionModalOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
