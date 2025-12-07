"use client";

import { useState } from "react";
import { X } from "lucide-react";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionForm from "@/components/forms/TransactionForm";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction, TransactionType } from "@/types";

import { useLanguage } from "@/contexts/LanguageContext";

export default function TransactionsPage() {
    const { t } = useLanguage();
    const { transactions } = useFinance();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState("");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("");

    // Extract unique categories
    const availableCategories = Array.from(new Set(transactions.map(t => t.category))).sort();

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        const matchesCategory = categoryFilter === '' || transaction.category === categoryFilter;
        const matchesPaymentMethod = paymentMethodFilter === '' || transaction.paymentMethod === paymentMethodFilter;

        return matchesSearch && matchesType && matchesCategory && matchesPaymentMethod;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{t('transactions')}</h1>
                <p className="text-gray-500">{t('transactions_subtitle')}</p>
            </div>

            <TransactionFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                paymentMethodFilter={paymentMethodFilter}
                onPaymentMethodChange={setPaymentMethodFilter}
                availableCategories={availableCategories}
            />

            <TransactionList
                transactions={filteredTransactions}
                onEdit={(transaction) => setEditingTransaction(transaction)}
            />

            {/* Edit Transaction Modal */}
            {editingTransaction && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-md">
                            <button
                                onClick={() => setEditingTransaction(null)}
                                className="absolute -top-10 right-0 text-white/70 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <TransactionForm
                                initialData={editingTransaction}
                                onClose={() => setEditingTransaction(null)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
