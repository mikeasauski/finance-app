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
    const [isOpen, setIsOpen] = useState(false);
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
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
            >
                <Menu size={24} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            F
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Finance.ai</h1>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 space-y-4">
                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        <span>Nova Transação</span>
                    </button>

                    {/* User Profile / Footer */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            {user?.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Usuário"}</p>
                                <button
                                    onClick={logout}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    Sair (Bloquear)
                                </button>
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
