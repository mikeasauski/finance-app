"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import SummaryCards from "./SummaryCards";
import GoalsWidget from "./GoalsWidget";
import { BalanceChart } from "./BalanceChart";
import UpcomingExpenses from "./UpcomingExpenses";
import { ContextType } from "@/types";
import { useFinance } from "@/contexts/FinanceContext";
import { useLanguage } from "@/contexts/LanguageContext";

import TransactionForm from "../forms/TransactionForm";
import RecentTransactions from "./RecentTransactions";
import CardsCarousel from "./CardsCarousel";
import WeeklyBills from "./WeeklyBills";
import CreditCardForm from "../forms/CreditCardForm";
import InvoiceView from "../credit-card/InvoiceView";
import { CreditCard } from "@/types";

export default function Dashboard() {
    const { t } = useLanguage();
    const { transactions, cards, removeCard } = useFinance();
    const [context, setContext] = useState<ContextType>('PF');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCardFormOpen, setIsCardFormOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
    const [selectedInvoiceCard, setSelectedInvoiceCard] = useState<CreditCard | null>(null);

    const handleEditCard = (card: CreditCard) => {
        setEditingCard(card);
        setIsCardFormOpen(true);
    };

    const handleDeleteCard = (cardId: string) => {
        if (confirm(t('confirm_delete_card', { cardName: cards.find(c => c.id === cardId)?.name || '' }))) {
            removeCard(cardId);
        }
    };

    const handleCloseCardForm = () => {
        setIsCardFormOpen(false);
        setEditingCard(null);
    };

    // Calculate invoice for a specific card, filtered by context
    const getCardInvoice = (cardId: string) => {
        return transactions
            .filter(t => t.cardId === cardId && t.type === 'expense' && t.context === context)
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    // Filter cards by selected context
    const filteredCards = cards.filter(card => card.context === context);

    // Calculate Best Buy Card
    const today = new Date().getDate();
    const bestCard = filteredCards.find(c => {
        let bestDay = c.closingDay + 1;
        if (bestDay > 31) bestDay = 1;
        return today === bestDay;
    });

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('overview')}</h2>
                    <p className="text-gray-500">{t('dashboard_subtitle')}</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Context Switcher */}
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            onClick={() => setContext('PF')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${context === 'PF'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('personal')}
                        </button>
                        <button
                            onClick={() => setContext('PJ')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${context === 'PJ'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('business')}
                        </button>
                    </div>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">{t('new_transaction')}</span>
                    </button>
                </div>
            </div>



            {/* Summary Cards */}
            <SummaryCards context={context} />

            {/* Cards Carousel */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-800">{t('my_cards')}</h3>
                        {/* {bestCard && (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full animate-pulse">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                Melhor hoje: {bestCard.name}
                            </span>
                        )} */}
                    </div>
                    <button
                        onClick={() => setIsCardFormOpen(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {t('view_all')}
                    </button>
                </div>
                <CardsCarousel
                    cards={filteredCards}
                    transactions={transactions}
                    onAddCard={() => setIsCardFormOpen(true)}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                    onViewInvoice={setSelectedInvoiceCard}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Middle Row: Charts & Expenses */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-800">{t('cash_flow')}</h3>
                            <select className="text-sm border-gray-200 rounded-lg text-gray-600">
                                <option>{t('last_6_months')}</option>
                            </select>
                        </div>
                        <BalanceChart />
                    </div>

                    <WeeklyBills />

                    <RecentTransactions transactions={transactions} />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    <UpcomingExpenses transactions={transactions} />
                    <GoalsWidget />
                </div>
            </div>

            {/* Invoice Modal */}
            {selectedInvoiceCard && (
                <InvoiceView
                    card={selectedInvoiceCard}
                    transactions={transactions}
                    onClose={() => setSelectedInvoiceCard(null)}
                />
            )}

            {/* Transaction Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-lg">
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-200"
                            >
                                <X size={32} />
                            </button>
                            <TransactionForm onClose={() => setIsFormOpen(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Card Modal */}
            {isCardFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
                        <button
                            onClick={handleCloseCardForm}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <CreditCardForm
                            onClose={handleCloseCardForm}
                            initialData={editingCard || undefined}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
