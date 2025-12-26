"use client";

import { ContextType } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

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
            {/* Balance Card */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Wallet className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                        {t('total_balance')}
                    </span>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm mb-1">{t('current_balance')}</p>
                    <h3 className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                    </h3>
                    {context === 'PJ' ? (
                        <p className="text-xs text-muted-foreground mt-2">
                            Runway estimado: <span className="font-bold text-foreground">{runwayDays} dias</span>
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground mt-2">
                            Liberdade Financeira: <span className="font-bold text-foreground">{financialFreedomMonths} meses</span>
                        </p>
                    )}
                </div>
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
                    <h3 className="text-2xl font-bold text-foreground">                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
                    </h3>
                </div>
            </div>
        </div>
    );
}
