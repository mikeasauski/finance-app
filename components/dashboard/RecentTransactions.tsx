"use client";

import { Transaction } from "@/types";
import { ArrowDownLeft, ArrowUpRight, CreditCard } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const { t, locale } = useLanguage();
    // Group transactions by description (for recurring ones) or ID
    const recent = Object.values(
        transactions.reduce((acc, t) => {
            const key = t.recurrence ? t.description : t.id;
            if (!acc[key]) acc[key] = [];
            acc[key].push(t);
            return acc;
        }, {} as Record<string, Transaction[]>)
    ).map(group => {
        // If it's a single transaction, return it
        if (group.length === 1) return group[0];

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

        const sortedGroup = group.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

        const earliestPending = group
            .filter(t => !t.isPaid && t.status !== 'paid')
            .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())[0];
        const latestPaid = sortedGroup.find(t => t.isPaid || t.status === 'paid');

        // Prefer earliest pending (next bill), otherwise latest history
        const displayTransaction = earliestPending || latestPaid || sortedGroup[0];

        return displayTransaction;
    })
        .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()) // Sort the leaders by date
        .slice(0, 5);

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">{t('recent_transactions')}</h3>
            <div className="space-y-6">
                {recent.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className={`p-3 rounded-xl flex-shrink-0 ${transaction.type === 'income'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                }`}>
                                {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                    {transaction.description}
                                    {transaction.installments && (
                                        <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">                                            {transaction.installments.current}/{transaction.installments.total}
                                        </span>
                                    )}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                                    <span className="truncate">{transaction.category}</span>
                                    <span>•</span>
                                    <span className="whitespace-nowrap">{format(parseISO(transaction.date), "d 'de' MMM", { locale })}</span>
                                    {transaction.status === 'pending' && (
                                        <span className="text-orange-500 bg-orange-50 px-1.5 rounded whitespace-nowrap">{t('pending')}</span>)}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                                }`}>
                                {transaction.type === 'expense' ? '- ' : '+ '}
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                            </p>
                            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
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
