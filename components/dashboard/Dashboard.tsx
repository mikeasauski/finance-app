"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import SummaryCards from "./SummaryCards";
import GoalsWidget from "./GoalsWidget";
import BalanceChart from "./BalanceChart";
import UpcomingExpenses from "./UpcomingExpenses";
import { ContextType } from "@/types";
import { useFinance } from "@/contexts/FinanceContext";

import TransactionForm from "../forms/TransactionForm";
import CreditCardWidget from "../credit-card/CreditCardWidget";

export default function Dashboard() {
    const { transactions } = useFinance();
    const [context, setContext] = useState<ContextType>('PF');
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
                    <p className="text-gray-500">Bem-vindo de volta!</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Context Switcher */}
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            onClick={() => setContext('PF')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${context === 'PF'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Pessoal
                        </button>
                        <button
                            onClick={() => setContext('PJ')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${context === 'PJ'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Empresarial
                        </button>
                    </div>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">Nova Transação</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <SummaryCards context={context} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-800">Fluxo de Caixa</h3>
                            <select className="text-sm border-gray-200 rounded-md text-gray-500">
                                <option>Últimos 30 dias</option>
                                <option>Este ano</option>
                            </select>
                        </div>
                        <BalanceChart />
                    </div>

                    {/* Credit Card Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CreditCardWidget
                            card={{ id: "1", name: "Nubank", limit: 5000, closingDay: 20, dueDay: 27 }}
                            currentInvoice={1254.30}
                        />
                        <CreditCardWidget
                            card={{ id: "2", name: "Inter", limit: 10000, closingDay: 5, dueDay: 12 }}
                            currentInvoice={340.00}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    <UpcomingExpenses transactions={transactions} />
                    <GoalsWidget />
                </div>
            </div>

            {/* Transaction Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-lg">
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-200"
                            >
                                <X size={32} />
                            </button>
                            <TransactionForm onClose={() => setIsFormOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
