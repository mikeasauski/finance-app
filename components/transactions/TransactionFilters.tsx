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

import { useLanguage } from "@/contexts/LanguageContext";

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
    const { t } = useLanguage();
    return (
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
            {/* Search */}
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 p-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Type Filter */}
                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => onTypeFilterChange('all')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${typeFilter === 'all'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {t('all')}
                    </button>
                    <button
                        onClick={() => onTypeFilterChange('income')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${typeFilter === 'income'
                            ? 'bg-card text-green-600 dark:text-green-400 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {t('revenue')}
                    </button>
                    <button
                        onClick={() => onTypeFilterChange('expense')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${typeFilter === 'expense'
                            ? 'bg-card text-red-600 dark:text-red-400 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {t('expense')}
                    </button>
                </div>

                <div className="h-6 w-px bg-border hidden md:block" />

                {/* Category Filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">{t('all_categories')}</option>
                    {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {/* Payment Method Filter */}
                <select
                    value={paymentMethodFilter}
                    onChange={(e) => onPaymentMethodChange(e.target.value)}
                    className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">{t('all_methods')}</option>
                    <option value="credit">{t('credit')}</option>
                    <option value="debit">{t('debit')}</option>
                    <option value="pix">{t('pix')}</option>
                    <option value="cash">{t('cash')}</option>
                    <option value="transfer">{t('transfer')}</option>
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
