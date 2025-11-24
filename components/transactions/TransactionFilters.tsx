"use client";

import { Search, Filter } from "lucide-react";
import { TransactionType } from "@/types";

interface TransactionFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    typeFilter: TransactionType | 'all';
    onTypeFilterChange: (value: TransactionType | 'all') => void;
}

export default function TransactionFilters({
    searchTerm,
    onSearchChange,
    typeFilter,
    onTypeFilterChange
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

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <button
                    onClick={() => onTypeFilterChange('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'all'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => onTypeFilterChange('expense')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'expense'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Despesas
                </button>
                <button
                    onClick={() => onTypeFilterChange('income')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === 'income'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Receitas
                </button>
            </div>
        </div>
    );
}
