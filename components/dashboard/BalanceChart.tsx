"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFinance } from "@/contexts/FinanceContext";
import { useMemo } from "react";
import { startOfMonth, subMonths, format, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export function BalanceChart() {
    const { transactions } = useFinance();
    const { locale } = useLanguage();

    const data = useMemo(() => {
        const today = new Date();
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(today, 5 - i);
            return {
                date,
                monthName: format(date, 'MMM', { locale }).toUpperCase(),
                income: 0,
                expense: 0
            };
        });

        transactions.forEach(transaction => {
            const transactionDate = parseISO(transaction.date);

            last6Months.forEach(month => {
                const start = startOfMonth(month.date);
                const end = endOfMonth(month.date);

                if (isWithinInterval(transactionDate, { start, end })) {
                    if (transaction.type === 'income') {
                        month.income += transaction.amount;
                    } else if (transaction.type === 'expense') {
                        month.expense += transaction.amount;
                    }
                }
            });
        });

        return last6Months;
    }, [transactions, locale]);

    return (
        <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="monthName"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `R$ ${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                    />
                    <Bar
                        dataKey="income"
                        name="Entradas"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                    <Bar
                        dataKey="expense"
                        name="Saídas"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
