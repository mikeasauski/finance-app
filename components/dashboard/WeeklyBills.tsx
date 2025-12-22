"use client";

import React, { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types";
<<<<<<< HEAD
import { format, isSameDay, addDays, startOfDay, endOfDay, isAfter, isBefore, parseISO } from "date-fns";
import { CheckCircle2, AlertCircle, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WeeklyBills() {
    const { transactions, updateTransaction, accounts } = useFinance();
    const { t, locale } = useLanguage();
=======
import { format, isSameDay, addDays, startOfDay, endOfDay, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, AlertCircle, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WeeklyBills() {
    const { transactions, updateTransaction, accounts } = useFinance();
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    const [selectedBill, setSelectedBill] = useState<Transaction | null>(null);

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
<<<<<<< HEAD
        const date = parseISO(t.date);
        return isAfter(date, startOfDay(addDays(today, -1))) && isBefore(date, nextWeek);
    }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

    const handlePay = (bill: Transaction) => {
        if (confirm(t('mark_as_paid_confirm', { description: bill.description }))) {
=======
        const date = new Date(t.date);
        return isAfter(date, startOfDay(addDays(today, -1))) && isBefore(date, nextWeek);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const handlePay = (bill: Transaction) => {
        if (confirm(`Deseja marcar "${bill.description}" como pago?`)) {
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
            updateTransaction({
                ...bill,
                isPaid: true,
                status: 'paid'
            });
        }
    };

    if (billsThisWeek.length === 0) {
        return (
<<<<<<< HEAD
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="font-semibold text-foreground">{t('all_caught_up')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('no_pending_bills_7_days')}</p>
=======
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="text-green-500" size={24} />
                </div>
                <h3 className="font-semibold text-gray-800">Tudo em dia!</h3>
                <p className="text-sm text-gray-500 mt-1">Nenhuma conta pendente para os próximos 7 dias.</p>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
            </div>
        );
    }

    // Group by day
    const groupedBills: Record<string, Transaction[]> = {};
    billsThisWeek.forEach(bill => {
<<<<<<< HEAD
        const dateKey = format(parseISO(bill.date), 'yyyy-MM-dd');
=======
        const dateKey = format(new Date(bill.date), 'yyyy-MM-dd');
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
        if (!groupedBills[dateKey]) {
            groupedBills[dateKey] = [];
        }
        groupedBills[dateKey].push(bill);
    });

    return (
<<<<<<< HEAD
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon size={20} className="text-primary" />
                    {t('upcoming_bills_title')}
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                    {t('pending_count', { count: billsThisWeek.length })}
=======
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon size={20} className="text-blue-600" />
                    Contas da Semana
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {billsThisWeek.length} pendentes
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </span>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                {Object.entries(groupedBills).map(([dateKey, bills]) => {
<<<<<<< HEAD
                    const date = parseISO(dateKey);
                    let label = format(date, "EEEE, d 'de' MMMM", { locale });

                    if (isSameDay(date, today)) label = t('today');
                    else if (isSameDay(date, addDays(today, 1))) label = t('tomorrow');
=======
                    const date = new Date(dateKey + 'T00:00:00');
                    let label = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

                    if (isSameDay(date, today)) label = "Hoje";
                    else if (isSameDay(date, addDays(today, 1))) label = "Amanhã";
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

                    // Capitalize first letter
                    label = label.charAt(0).toUpperCase() + label.slice(1);

                    return (
                        <div key={dateKey}>
<<<<<<< HEAD
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-card py-1 z-10">
=======
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 sticky top-0 bg-white py-1 z-10">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                {label}
                            </h4>
                            <div className="space-y-3">
                                {bills.map(bill => (
<<<<<<< HEAD
                                    <div key={bill.id} className="group flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/20 hover:bg-muted/50 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                                                isSameDay(parseISO(bill.date), today) ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-muted text-muted-foreground"
=======
                                    <div key={bill.id} className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                                                isSameDay(new Date(bill.date), today) ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                            )}>
                                                {/* Icon or Initials */}
                                                {bill.description.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div>
<<<<<<< HEAD
                                                <p className="font-medium text-foreground text-sm">{bill.description}</p>
                                                <p className="text-xs text-muted-foreground">{bill.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-foreground">
                                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(bill.amount)}
=======
                                                <p className="font-medium text-gray-900 text-sm">{bill.description}</p>
                                                <p className="text-xs text-gray-500">{bill.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-gray-900">
                                                R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                            </span>
                                            <button
                                                onClick={() => handlePay(bill)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-green-600 hover:bg-green-100 rounded-full transition-all"
<<<<<<< HEAD
                                                title={t('pay_now')}
=======
                                                title="Pagar Agora"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                            >
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
