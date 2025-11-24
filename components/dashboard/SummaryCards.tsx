"use client";

import { ContextType } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

interface SummaryCardsProps {
    context: ContextType;
}

export default function SummaryCards({ context }: SummaryCardsProps) {
    const { transactions: allTransactions } = useFinance();

    // Filter transactions by context
    const transactions = allTransactions.filter(t => t.context === context);

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expense;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-md">
                            Total
                        </span>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Saldo Atual</p>
                        <h3 className="text-3xl font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                        </h3>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Income Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <ArrowUpRight className="text-green-600" size={24} />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        +12%
                    </span>
                </div>
                <div>
                    <p className="text-gray-500 text-sm mb-1">Receitas</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
                    </h3>
                </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <ArrowDownLeft className="text-red-600" size={24} />
                    </div>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                        -5%
                    </span>
                </div>
                <div>
                    <p className="text-gray-500 text-sm mb-1">Despesas</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
                    </h3>
                </div>
            </div>
        </div>
    );
}
