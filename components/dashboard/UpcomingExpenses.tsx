"use client";

import { Transaction } from "@/types";
import { format, isSameWeek, parseISO } from "date-fns";
import { CalendarClock, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UpcomingExpensesProps {
    transactions: Transaction[];
}

export default function UpcomingExpenses({ transactions }: UpcomingExpensesProps) {
    const { t, locale } = useLanguage();
    const today = new Date();

    // Filter expenses for the current week that are NOT paid
    const upcomingExpenses = transactions
        .filter(t => {
            if (t.type !== 'expense') return false;
            if (t.isPaid) return false; // Only show unpaid bills

            const expenseDate = parseISO(t.date);
            // Check if it's in the same week
            return isSameWeek(expenseDate, today, { locale });
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalUpcoming = upcomingExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">{t('upcoming_bills')}</h3>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                    <CalendarClock className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">{t('total_to_pay')}</p>
                <p className="text-2xl font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalUpcoming)}
                </p>
            </div>

            <div className="space-y-4">
                {upcomingExpenses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <div className="bg-green-50 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center">
                                <span className="text-green-500 font-bold text-xs">✓</span>
                            </div>
                        </div>
                        <p className="font-bold text-foreground mb-1">{t('all_caught_up')}</p>
                        <p className="text-sm">{t('no_pending_bills_7_days')}</p>
                    </div>
                ) : (
                    upcomingExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-card p-2 rounded-lg border border-border">
                                    <AlertCircle size={16} className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground line-clamp-1">{expense.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(parseISO(expense.date), "EEEE, d 'de' MMM", { locale })}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold text-foreground whitespace-nowrap">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
