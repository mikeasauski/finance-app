"use client";

import { Search, Filter } from "lucide-react";
import { TransactionType } from "@/types";

interface TransactionFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    typeFilter: TransactionType | 'all';
    onTypeFilterChange: (value: TransactionType | 'all') => void;
    categoryFilter: string;
    onCategoryChange: (value: string) => void;
    paymentMethodFilter: string;
    onPaymentMethodChange: (value: string) => void;
    availableCategories: string[];
}

export default function TransactionFilters({
    searchTerm,
    onSearchChange,
    typeFilter,
    onTypeFilterChange,
    categoryFilter,
    onCategoryChange,
    paymentMethodFilter,
    onPaymentMethodChange,
    availableCategories
}: TransactionFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            {/* Search */}
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Type Filter */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => onTypeFilterChange('all')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${typeFilter === 'all'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => onTypeFilterChange('income')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${typeFilter === 'income'
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Receitas
                    </button>
                    <button
                        onClick={() => onTypeFilterChange('expense')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${typeFilter === 'expense'
                            ? 'bg-white text-red-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Despesas
                    </button>
                </div>

                <div className="h-6 w-px bg-gray-200 hidden md:block" />

                {/* Category Filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="">Todas Categorias</option>
                    {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {/* Payment Method Filter */}
                <select
                    value={paymentMethodFilter}
                    onChange={(e) => onPaymentMethodChange(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="">Todos Métodos</option>
                    <option value="credit">Crédito</option>
                    <option value="debit">Débito</option>
                    <option value="pix">Pix</option>
                    <option value="cash">Dinheiro</option>
                    <option value="transfer">Transferência</option>
                </select>

                {(categoryFilter || paymentMethodFilter || typeFilter !== 'all' || searchTerm) && (
                    <button
                        onClick={() => {
                            onCategoryChange('');
                            onPaymentMethodChange('');
                            onTypeFilterChange('all');
                            onSearchChange('');
                        }}
                        className="ml-auto text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                        Limpar Filtros
                    </button>
                )}
            </div>
        </div>
    );
}
