"use client";

import React, { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types";
import { format, isSameDay, addDays, startOfDay, endOfDay, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, AlertCircle, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WeeklyBills() {
    const { transactions, updateTransaction, accounts } = useFinance();
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
        const date = new Date(t.date);
        return isAfter(date, startOfDay(addDays(today, -1))) && isBefore(date, nextWeek);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const handlePay = (bill: Transaction) => {
        if (confirm(`Deseja marcar "${bill.description}" como pago?`)) {
            updateTransaction({
                ...bill,
                isPaid: true,
                status: 'paid'
            });
        }
    };

    if (billsThisWeek.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="text-green-500" size={24} />
                </div>
                <h3 className="font-semibold text-gray-800">Tudo em dia!</h3>
                <p className="text-sm text-gray-500 mt-1">Nenhuma conta pendente para os próximos 7 dias.</p>
            </div>
        );
    }

    // Group by day
    const groupedBills: Record<string, Transaction[]> = {};
    billsThisWeek.forEach(bill => {
        const dateKey = format(new Date(bill.date), 'yyyy-MM-dd');
        if (!groupedBills[dateKey]) {
            groupedBills[dateKey] = [];
        }
        groupedBills[dateKey].push(bill);
    });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon size={20} className="text-blue-600" />
                    Contas da Semana
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {billsThisWeek.length} pendentes
                </span>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                {Object.entries(groupedBills).map(([dateKey, bills]) => {
                    const date = new Date(dateKey + 'T00:00:00');
                    let label = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

                    if (isSameDay(date, today)) label = "Hoje";
                    else if (isSameDay(date, addDays(today, 1))) label = "Amanhã";

                    // Capitalize first letter
                    label = label.charAt(0).toUpperCase() + label.slice(1);

                    return (
                        <div key={dateKey}>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 sticky top-0 bg-white py-1 z-10">
                                {label}
                            </h4>
                            <div className="space-y-3">
                                {bills.map(bill => (
                                    <div key={bill.id} className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                                                isSameDay(new Date(bill.date), today) ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                                            )}>
                                                {/* Icon or Initials */}
                                                {bill.description.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{bill.description}</p>
                                                <p className="text-xs text-gray-500">{bill.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-gray-900">
                                                R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                            <button
                                                onClick={() => handlePay(bill)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-green-600 hover:bg-green-100 rounded-full transition-all"
                                                title="Pagar Agora"
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
