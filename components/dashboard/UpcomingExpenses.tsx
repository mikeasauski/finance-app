"use client";

import { Transaction } from "@/types";
import { format, isSameWeek, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, AlertCircle } from "lucide-react";

interface UpcomingExpensesProps {
    transactions: Transaction[];
}

export default function UpcomingExpenses({ transactions }: UpcomingExpensesProps) {
    const today = new Date();

    // Filter expenses for the current week
    const upcomingExpenses = transactions
        .filter(t => {
            if (t.type !== 'expense') return false;
            const expenseDate = parseISO(t.date);
            // Check if it's in the same week
            return isSameWeek(expenseDate, today, { locale: ptBR });
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalUpcoming = upcomingExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Contas da Semana</h3>
                <div className="bg-orange-100 p-2 rounded-lg">
                    <CalendarClock className="text-orange-600" size={20} />
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
                <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalUpcoming)}
                </p>
            </div>

            <div className="space-y-4">
                {upcomingExpenses.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p>Nenhuma conta para esta semana 🎉</p>
                    </div>
                ) : (
                    upcomingExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                    <AlertCircle size={16} className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 line-clamp-1">{expense.description}</p>
                                    <p className="text-xs text-gray-500">
                                        {format(parseISO(expense.date), "EEEE, d 'de' MMM", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold text-gray-900 whitespace-nowrap">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
