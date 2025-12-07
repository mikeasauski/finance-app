"use client";

import { Transaction } from "@/types";
import { ArrowDownLeft, ArrowUpRight, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const { t, locale } = useLanguage();
    // Group transactions by description (proxy for series)
    // For each group, pick the most relevant one to show
    const groupedTransactions = transactions.reduce((acc, t) => {
        // Create a unique key for grouping. 
        // Ideally we'd have a groupId, but description + category + amount is a decent proxy for now
        // or just description if it's unique enough for the series
        const key = `${t.description}-${t.category}`;

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(t);
        return acc;
    }, {} as Record<string, Transaction[]>);

    const recent = Object.values(groupedTransactions)
        .map(group => {
            // Sort group by date descending
            const sortedGroup = group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // If it's a recurrence series (installments or subscription)
            // We want to show:
            // 1. The next pending item (if any)
            // 2. OR the most recent paid item (if all pending are in far future?)
            // Actually, user wants "Netflix 1/12" style.

            // Let's find the first "pending" one that is due soon or overdue?
            // Or just the most recent one based on date?

            // If we just take the most recent by date, we might see "Netflix 12/12" (future) instead of "1/12" (current).
            // We should find the *current* active one.
            // Current = First pending one? Or last paid one?

            // Let's try: Find the first pending transaction sorted by date ASC (earliest pending).
            // If no pending, take the latest paid (sorted by date DESC).

            const earliestPending = group
                .filter(t => !t.isPaid && t.status !== 'paid')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

            const latestPaid = sortedGroup.find(t => t.isPaid || t.status === 'paid');

            // Prefer earliest pending (next bill), otherwise latest history
            const displayTransaction = earliestPending || latestPaid || sortedGroup[0];

            return displayTransaction;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort the leaders by date
        .slice(0, 5);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">{t('recent_transactions')}</h3>
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
                                    {transaction.installments && (
                                        <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {transaction.installments.current}/{transaction.installments.total}
                                        </span>
                                    )}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{transaction.category}</span>
                                    <span>•</span>
                                    <span>{format(new Date(transaction.date), "d 'de' MMM", { locale })}</span>
                                    {transaction.status === 'pending' && (
                                        <span className="text-orange-500 bg-orange-50 px-1.5 rounded">{t('pending')}</span>
                                    )}
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
