
"use client";

import { useState, useEffect } from "react";
import { Plus, X, Wallet } from "lucide-react";
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

import ProlaboreModal from "../modals/ProlaboreModal";

export default function Dashboard() {
    const { t } = useLanguage();
    const { transactions, cards, removeCard, appContext: context, setAppContext: setContext, addTransaction, accounts } = useFinance();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCardFormOpen, setIsCardFormOpen] = useState(false);
    const [isProlaboreModalOpen, setIsProlaboreModalOpen] = useState(false); const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
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

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when any modal is open
    useEffect(() => {
        if (isFormOpen || isCardFormOpen || isProlaboreModalOpen || !!selectedInvoiceCard || !!editingCard) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFormOpen, isCardFormOpen, isProlaboreModalOpen, selectedInvoiceCard, editingCard]);

    // Calculate Balance
    const balance = transactions
        .filter(t => t.context === context && t.isPaid)
        .reduce((acc, curr) => {
            return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
        }, 0);

    const income = transactions
        .filter(t => t.context === context && t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = transactions
        .filter(t => t.context === context && t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);
    const filteredCards = cards.filter(c => c.context === context);

    return (
        <div className="space-y-6 max-w-full">
            {/* Context Switcher */}
            <div className="flex justify-center w-full relative z-20">
                <div className="bg-muted p-1 rounded-full inline-flex">
                    <button
                        onClick={() => setContext('PF')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${context === 'PF'
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            } `}
                    >
                        {t('personal')}
                    </button>
                    <button
                        onClick={() => setContext('PJ')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${context === 'PJ'
                            ? 'bg-orange-500 text-white shadow-md transform scale-105'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            } `}
                    >
                        {t('business')}
                    </button>
                </div >
            </div >

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 mt-4 md:mt-0 text-center md:text-left">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{t('dashboard')}</h2>
                    <p className="text-muted-foreground">{t('dashboard_subtitle')}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">{t('new_transaction')}</span>
                    </button>
                </div>
            </div >

            {/* Pro-labore Action Widget (Only for PJ) */}
            {
                context === 'PJ' && (
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Wallet className="text-green-100" />
                                Pró-Labore
                            </h3>
                            <p className="text-green-100 mt-1">
                                Realize a transferência de lucros para sua conta pessoal de forma simples.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsProlaboreModalOpen(true)}
                            className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-md whitespace-nowrap"
                        >
                            Lançar Pró-Labore
                        </button>
                    </div>
                )
            }
            {/* Summary Cards */}
            <SummaryCards context={context} />

            {/* Cards Carousel */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{t('my_cards')}</h3>                        {/* {bestCard && (
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
                        {t('view_all')}                    </button>
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
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-foreground">{t('cash_flow')}</h3>
                            <select className="text-sm border-border rounded-lg text-muted-foreground bg-transparent">
                                <option>{t('last_6_months')}</option>                            </select>
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
            {
                selectedInvoiceCard && (
                    <InvoiceView
                        card={selectedInvoiceCard}
                        transactions={transactions}
                        onClose={() => setSelectedInvoiceCard(null)}
                    />
                )
            }

            {/* Transaction Modal */}
            {
                isFormOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
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
                )
            }

            {/* Card Modal */}
            {
                isCardFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl my-auto">                        <button
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
                )
            }

            {/* Prolabore Modal */}
            {
                isProlaboreModalOpen && (
                    <ProlaboreModal
                        onClose={() => setIsProlaboreModalOpen(false)}
                    />
                )
            }
        </div >
    );
}
