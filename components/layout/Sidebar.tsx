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
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import TransactionForm from "@/components/forms/TransactionForm";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transações", href: "/transactions", icon: ArrowLeftRight },
    { name: "Cartões", href: "/cards", icon: CreditCard },
    { name: "Renda", href: "/income", icon: Wallet },
    { name: "Configurações", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden text-gray-700"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 border-b border-border">
                        <h1 className="text-2xl font-bold text-primary">Finanças</h1>
                    </div>

                    {/* New Transaction Button */}
                    <div className="p-4">
                        <button
                            onClick={() => setIsTransactionModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            <Plus size={20} />
                            <span>Nova Transação</span>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Footer (Optional) */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 font-bold">
                                U
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Usuário</p>
                                <p className="text-xs text-gray-500">Premium</p>
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
