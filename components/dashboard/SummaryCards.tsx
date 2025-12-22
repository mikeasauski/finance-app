"use client";

import { ContextType } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

interface SummaryCardsProps {
    context: ContextType;
}

export default function SummaryCards({ context }: SummaryCardsProps) {
    const { t } = useLanguage();
    const { transactions: allTransactions, accounts } = useFinance();

    // Filter transactions by context
    const transactions = allTransactions.filter(t => t.context === context);

    // Calculate Account Balances (includes initial balance + linked transactions)
    const accountsBalance = accounts
        .filter(a => a.context === context)
        .reduce((acc, curr) => acc + curr.balance, 0);

    // Calculate Cash Balance (Transactions NOT linked to accounts, e.g. Cash)
    // Credit card expenses don't affect cash balance immediately.
    const cashTransactions = transactions.filter(t => !t.accountId && t.paymentMethod === 'cash');

    const cashBalance = cashTransactions.reduce((acc, curr) => {
        return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
    }, 0);

    const balance = accountsBalance + cashBalance;

    // Calculate Monthly Stats
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyTransactions = transactions.filter(t => {
        const date = parseISO(t.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate Average Monthly Expense (Last 3 Months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const expensesLast3Months = transactions
        .filter(t => t.type === 'expense' && t.context === context && new Date(t.date) >= threeMonthsAgo)
        .reduce((acc, curr) => acc + curr.amount, 0);

    const averageMonthlyExpense = expensesLast3Months / 3 || 1; // Avoid division by zero

    // Business Metric: Runway (Days)
    const runwayDays = Math.floor(balance / (averageMonthlyExpense / 30));

    // Personal Metric: Financial Freedom (Months)
    // Assuming "Invested" is represented by specific category or account type. 
    // For prototype, we'll use "Investments" category or just Total Balance as "Net Worth" approximation for now.
    // User prompt said: "Saldo Investido / Custo de Vida Mensal".
    // Let's approximate "Invested" as balance in accounts with type 'investment' (if we had it) or just Total Balance for now.
    const financialFreedomMonths = (balance / averageMonthlyExpense).toFixed(1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Smart Health Widget */}
            {/* Balance Card */}
            <div className={`p-6 rounded-2xl text-white shadow-lg relative overflow-hidden transition-all duration-500 ${context === 'PJ' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-orange-500 shadow-orange-500/20'
                }`}>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-md">
                            {t('balance')}
                        </span>
                    </div>

                    <div>
                        <p className="text-white/80 text-sm mb-1">{t('current_balance')}</p>
                        <h3 className="text-3xl font-bold mb-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                        </h3>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Income Card */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <ArrowUpRight className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                        {t('income')}
                    </span>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm mb-1">{t('income_month')}</p>
                    <h3 className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
                    </h3>
                </div>
            </div>

            {/* Expense Card */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <ArrowDownLeft className="text-red-600 dark:text-red-400" size={24} />
                    </div>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
                        {t('expense')}
                    </span>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm mb-1">{t('expense_month')}</p>
                    <h3 className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
                    </h3>
                </div>
            </div>
        </div>
    );
}
