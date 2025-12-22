"use client";

import { useState } from "react";
import { Wallet, Plus, X, TrendingUp, Calendar } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionForm from "@/components/forms/TransactionForm";
import { Transaction } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export default function IncomePage() {
    const { transactions } = useFinance();
<<<<<<< HEAD
    const { t, locale } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

=======
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
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
<<<<<<< HEAD
                    <h1 className="text-2xl font-bold text-foreground">{t('income_title')}</h1>
                    <p className="text-muted-foreground">{t('income_subtitle')}</p>
=======
                    <h1 className="text-2xl font-bold text-gray-800">Renda</h1>
                    <p className="text-gray-500">Gerencie seus recebimentos e salários</p>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                    <Plus size={20} />
<<<<<<< HEAD
                    <span>{t('new_income_button')}</span>
=======
                    <span>Nova Renda</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </button>
            </div>

            {/* Summary Cards */}
<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                        {t('income_history')}
                    </h2>
                    <div className="h-64 flex items-end justify-between gap-2">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{t('total_received_general')}</p>
                            <h3 className="text-2xl font-bold text-foreground">
                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(totalIncome)}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{t('this_month')}</p>
                            <h3 className="text-2xl font-bold text-foreground">
                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(currentMonthIncome)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income List */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">{t('income_history')}</h2>
                <TransactionList
                    transactions={incomeTransactions}
                    onEdit={handleEdit}
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-md">
                            <TransactionForm
                                onClose={handleCloseModal}
                                initialData={editingTransaction || undefined}
                                defaultType="income"
                                lockType={true}
                            />
=======
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <TrendingUp size={24} />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Recebido (Geral)</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
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
                            <p className="text-sm text-gray-500 font-medium">Este Mês</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentMonthIncome)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income List */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Recebimentos</h2>
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
