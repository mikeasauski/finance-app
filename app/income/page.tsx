"use client";

import { useState } from "react";
import { Wallet, Plus, X, TrendingUp, Calendar } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionForm from "@/components/forms/TransactionForm";
import { Transaction } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function IncomePage() {
    const { transactions } = useFinance();
    const { t, locale } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Filter only income transactions
    const incomeTransactions = transactions.filter(t => t.type === 'income');

    // Calculate totals
    const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const currentMonthIncome = incomeTransactions
        .filter(t => {
            const tDate = new Date(t.date);
            const now = new Date();
            return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        })
        .reduce((acc, t) => acc + t.amount, 0);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('income_title')}</h1>
                    <p className="text-gray-500">{t('income_subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                    <Plus size={20} />
                    <span>{t('new_income_button')}</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{t('total_received_general')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(totalIncome)}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{t('this_month')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(currentMonthIncome)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income List */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('income_history')}</h2>
                <TransactionList
                    transactions={incomeTransactions}
                    onEdit={handleEdit}
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <TransactionForm
                            onClose={handleCloseModal}
                            initialData={editingTransaction || undefined}
                            defaultType="income"
                            lockType={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
