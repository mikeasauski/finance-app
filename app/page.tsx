"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import { useFinance } from "@/contexts/FinanceContext";

export default function Home() {
    const { transactions } = useFinance();

    return (
        <div className="space-y-6">


            <Dashboard />
        </div>
    );
}
