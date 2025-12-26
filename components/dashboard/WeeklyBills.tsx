"use client";

import React, { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types";
import { format, isSameDay, addDays, startOfDay, endOfDay, isAfter, isBefore, parseISO } from "date-fns";
import { CheckCircle2, AlertCircle, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WeeklyBills() {
    const { transactions, updateTransaction, accounts } = useFinance();
    const { t, locale } = useLanguage();    const [selectedBill, setSelectedBill] = useState<Transaction | null>(null);

    // Filter pending expenses
    const pendingBills = transactions.filter(t =>
        t.type === 'expense' &&
        !t.isPaid &&
        t.status !== 'paid'
    );

    // Get next 7 days
    const today = startOfDay(new Date());
    const nextWeek = endOfDay(addDays(today, 6));

    const billsThisWeek = pendingBills.filter(t => {
        const date = parseISO(t.date);
        return isAfter(date, startOfDay(addDays(today, -1))) && isBefore(date, nextWeek);
    }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

    const handlePay = (bill: Transaction) => {
        if (confirm(t('mark_as_paid_confirm', { description: bill.description }))) {            updateTransaction({
                ...bill,
                isPaid: true,
                status: 'paid'
            });
        }
    };

    if (billsThisWeek.length === 0) {
        return (
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="font-semibold text-foreground">{t('all_caught_up')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('no_pending_bills_7_days')}</p>            </div>
        );
    }

    // Group by day
    const groupedBills: Record<string, Transaction[]> = {};
    billsThisWeek.forEach(bill => {
        const dateKey = format(parseISO(bill.date), 'yyyy-MM-dd');        if (!groupedBills[dateKey]) {
            groupedBills[dateKey] = [];
        }
        groupedBills[dateKey].push(bill);
    });

    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon size={20} className="text-primary" />
                    {t('upcoming_bills_title')}
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                    {t('pending_count', { count: billsThisWeek.length })}                </span>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                {Object.entries(groupedBills).map(([dateKey, bills]) => {
                    const date = parseISO(dateKey);
                    let label = format(date, "EEEE, d 'de' MMMM", { locale });

                    if (isSameDay(date, today)) label = t('today');
                    else if (isSameDay(date, addDays(today, 1))) label = t('tomorrow');
                    // Capitalize first letter
                    label = label.charAt(0).toUpperCase() + label.slice(1);

                    return (
                        <div key={dateKey}>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-card py-1 z-10">                                {label}
                            </h4>
                            <div className="space-y-3">
                                {bills.map(bill => (
                                    <div key={bill.id} className="group flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/20 hover:bg-muted/50 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                                                isSameDay(parseISO(bill.date), today) ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-muted text-muted-foreground"                                            )}>
                                                {/* Icon or Initials */}
                                                {bill.description.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground text-sm">{bill.description}</p>
                                                <p className="text-xs text-muted-foreground">{bill.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-foreground">
                                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(bill.amount)}                                            </span>
                                            <button
                                                onClick={() => handlePay(bill)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-green-600 hover:bg-green-100 rounded-full transition-all"
                                                title={t('pay_now')}                                            >
                                                <CheckCircle2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
