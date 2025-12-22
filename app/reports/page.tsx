"use client";

import { useFinance } from "@/contexts/FinanceContext";
import { PieChart, BarChart, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
<<<<<<< HEAD
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

export default function ReportsPage() {
    const { transactions } = useFinance();
    const { t, locale } = useLanguage();
=======

export default function ReportsPage() {
    const { transactions } = useFinance();
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

    // 1. Calculate Spending by Category
    const expenses = transactions.filter(t => t.type === 'expense');
    const expensesByCategory = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    const totalExpense = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

    const categoryData = Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
            color: getCategoryColor(category)
        }));

    // 2. Calculate Income vs Expense (Monthly)
    // Group by month (YYYY-MM)
    const monthlyData = transactions.reduce((acc, t) => {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!acc[key]) acc[key] = { income: 0, expense: 0 };

        if (t.type === 'income') {
            acc[key].income += t.amount;
        } else {
            acc[key].expense += t.amount;
        }

        return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    // Sort by date and take last 6 months
    const chartData = Object.entries(monthlyData)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .slice(-6);

    const maxChartValue = Math.max(
        ...chartData.map(([, d]) => Math.max(d.income, d.expense)),
        100 // Minimum scale
    );

    return (
        <div className="space-y-6">
            <div>
<<<<<<< HEAD
                <h1 className="text-2xl font-bold text-foreground">{t('reports_title')}</h1>
                <p className="text-muted-foreground">{t('reports_subtitle')}</p>
=======
                <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
                <p className="text-gray-500">Análise detalhada das suas finanças</p>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending by Category (Pie Chart Representation) */}
<<<<<<< HEAD
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <PieChart size={20} className="text-blue-600" />
                        {t('spending_by_category')}
=======
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <PieChart size={20} className="text-blue-600" />
                        Gastos por Categoria
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Simple CSS Conic Gradient Pie Chart */}
                        <div
                            className="w-48 h-48 rounded-full relative shrink-0"
                            style={{
                                background: `conic-gradient(${categoryData.map((d, i, arr) => {
                                    const prevPercentage = arr.slice(0, i).reduce((sum, item) => sum + item.percentage, 0);
                                    return `${d.color} ${prevPercentage}% ${prevPercentage + d.percentage}%`;
                                }).join(', ')})`
                            }}
                        >
<<<<<<< HEAD
                            <div className="absolute inset-0 m-8 bg-card rounded-full flex items-center justify-center flex-col shadow-inner">
                                <span className="text-xs text-muted-foreground">{t('total')}</span>
                                <span className="font-bold text-foreground">
                                    {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD', maximumFractionDigits: 0 }).format(totalExpense)}
=======
                            <div className="absolute inset-0 m-8 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
                                <span className="text-xs text-gray-500">Total</span>
                                <span className="font-bold text-gray-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalExpense)}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 w-full space-y-3">
                            {categoryData.map((item) => (
                                <div key={item.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
<<<<<<< HEAD
                                        <span className="text-foreground">{item.category}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-foreground">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(item.amount)}
                                        </span>
                                        <span className="text-xs text-muted-foreground w-8 text-right">{item.percentage.toFixed(0)}%</span>
=======
                                        <span className="text-gray-700">{item.category}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-gray-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amount)}
                                        </span>
                                        <span className="text-xs text-gray-500 w-8 text-right">{item.percentage.toFixed(0)}%</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Income vs Expense (Bar Chart) */}
<<<<<<< HEAD
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <BarChart size={20} className="text-purple-600" />
                        {t('income_vs_expense')}
=======
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart size={20} className="text-purple-600" />
                        Receita vs Despesa (Últimos 6 meses)
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    </h2>

                    <div className="h-64 flex items-end justify-between gap-4 pt-8">
                        {chartData.map(([month, data]) => {
                            const incomeHeight = (data.income / maxChartValue) * 100;
                            const expenseHeight = (data.expense / maxChartValue) * 100;
                            const [year, monthNum] = month.split('-');
<<<<<<< HEAD
                            // Use date-fns format with locale for month name
                            const dateObj = new Date(Number(year), Number(monthNum) - 1);
                            const monthName = format(dateObj, 'MMM', { locale });
=======
                            const monthName = new Date(Number(year), Number(monthNum) - 1).toLocaleDateString('pt-BR', { month: 'short' });
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

                            return (
                                <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                    <div className="w-full flex justify-center gap-1 h-full items-end relative">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
<<<<<<< HEAD
                                            <div className="text-green-400">{t('revenue')}: {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(data.income)}</div>
                                            <div className="text-red-400">{t('expense')}: {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(data.expense)}</div>
=======
                                            <div className="text-green-400">Receita: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.income)}</div>
                                            <div className="text-red-400">Despesa: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.expense)}</div>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                        </div>

                                        {/* Income Bar */}
                                        <div
                                            className="w-3 md:w-6 bg-green-500 rounded-t-sm transition-all duration-500 hover:bg-green-600"
                                            style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                                        ></div>
                                        {/* Expense Bar */}
                                        <div
                                            className="w-3 md:w-6 bg-red-500 rounded-t-sm transition-all duration-500 hover:bg-red-600"
                                            style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                                        ></div>
                                    </div>
<<<<<<< HEAD
                                    <span className="text-xs text-muted-foreground font-medium uppercase">{monthName}</span>
=======
                                    <span className="text-xs text-gray-500 font-medium uppercase">{monthName}</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                </div>
                            );
                        })}

                        {chartData.length === 0 && (
<<<<<<< HEAD
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                {t('not_enough_data')}
=======
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem dados suficientes
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        'Alimentação': '#f59e0b', // amber-500
        'Transporte': '#3b82f6', // blue-500
        'Moradia': '#8b5cf6', // violet-500
        'Lazer': '#ec4899', // pink-500
        'Saúde': '#ef4444', // red-500
        'Educação': '#10b981', // emerald-500
        'Compras': '#6366f1', // indigo-500
        'Assinaturas': '#14b8a6', // teal-500
        'Serviços': '#64748b', // slate-500
        'Outros': '#9ca3af', // gray-400
    };
    return colors[category] || '#9ca3af';
}
