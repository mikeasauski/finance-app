"use client";

import { Transaction } from "@/types";
import { ArrowDownLeft, ArrowUpRight, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    // Sort by date (descending) and take top 5
    const recent = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Transações Recentes</h3>
            <div className="space-y-6">
                {recent.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${transaction.type === 'income'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                                }`}>
                                {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {transaction.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{transaction.category}</span>
                                    <span>•</span>
                                    <span>{format(new Date(transaction.date), "d 'de' MMM", { locale: ptBR })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                {transaction.type === 'expense' ? '- ' : '+ '}
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                            </p>
                            <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
                                {transaction.paymentMethod === 'credit' && <CreditCard size={12} />}
                                <span className="capitalize">{transaction.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
