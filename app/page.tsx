"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { useFinance } from "@/contexts/FinanceContext";

export default function Home() {
    const { transactions } = useFinance();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Visão geral das suas finanças</p>
            </div>

            <Dashboard />
            <RecentTransactions transactions={transactions} />
        </div>
    );
}
