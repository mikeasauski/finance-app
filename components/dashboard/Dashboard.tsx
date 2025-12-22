
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
<<<<<<< HEAD

import ProlaboreModal from "../modals/ProlaboreModal";

export default function Dashboard() {
    const { t } = useLanguage();
    const { transactions, cards, removeCard, appContext: context, setAppContext: setContext, addTransaction, accounts } = useFinance();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCardFormOpen, setIsCardFormOpen] = useState(false);
    const [isProlaboreModalOpen, setIsProlaboreModalOpen] = useState(false);
=======

export default function Dashboard() {
    const { transactions, cards, removeCard } = useFinance();
    const [context, setContext] = useState<ContextType>('PF');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCardFormOpen, setIsCardFormOpen] = useState(false);
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
    const [selectedInvoiceCard, setSelectedInvoiceCard] = useState<CreditCard | null>(null);

    const handleEditCard = (card: CreditCard) => {
        setEditingCard(card);
        setIsCardFormOpen(true);
    };

    const handleDeleteCard = (cardId: string) => {
<<<<<<< HEAD
        if (confirm(t('confirm_delete_card', { cardName: cards.find(c => c.id === cardId)?.name || '' }))) {
=======
        if (confirm("Tem certeza que deseja excluir este cartão?")) {
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
            removeCard(cardId);
        }
    };

    const handleCloseCardForm = () => {
        setIsCardFormOpen(false);
        setEditingCard(null);
    };

<<<<<<< HEAD
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

=======
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
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
<<<<<<< HEAD

    if (!mounted) {
        return null; // or a loading skeleton
    }

    return (
        <div className="space-y-6 relative pt-16 md:pt-0">
            {/* Centered Fixed Context Switcher */}
            <div className="fixed top-20 md:top-4 left-0 right-0 flex justify-center z-30 pointer-events-none">
                <div className="bg-card/80 backdrop-blur-md p-1 rounded-full shadow-lg border border-border flex pointer-events-auto">
=======

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
                    <p className="text-gray-500">Bem-vindo de volta!</p>
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
                            Pessoal
                        </button>
                        <button
                            onClick={() => setContext('PJ')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${context === 'PJ'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Empresarial
                        </button>
                    </div>

>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    <button
                        onClick={() => setContext('PF')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${context === 'PF'
                            ? 'bg-orange-500 text-white shadow-md transform scale-105'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            } `}
                    >
                        {t('personal')}
                    </button>
                    <button
                        onClick={() => setContext('PJ')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${context === 'PJ'
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            } `}
                    >
                        {t('business')}
                    </button>
                </div>
            </div>

<<<<<<< HEAD
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 mt-8 md:mt-0">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{t('dashboard')}</h2>
                    <p className="text-muted-foreground">{t('dashboard_subtitle')}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">{t('new_transaction')}</span>
                    </button>
                </div>
            </div>

            {/* Pro-labore Action Widget (Only for PJ) */}
            {context === 'PJ' && (
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
            )}
=======

>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

            {/* Summary Cards */}
            <SummaryCards context={context} />

            {/* Cards Carousel */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
<<<<<<< HEAD
                        <h3 className="font-semibold text-foreground">{t('my_cards')}</h3>
=======
                        <h3 className="font-semibold text-gray-800">Meus Cartões</h3>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
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
<<<<<<< HEAD
                        {t('view_all')}
=======
                        Ver todos
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
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
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <div className="flex justify-between items-center mb-6">
<<<<<<< HEAD
                            <h3 className="font-semibold text-foreground">{t('cash_flow')}</h3>
                            <select className="text-sm border-border rounded-lg text-muted-foreground bg-transparent">
                                <option>{t('last_6_months')}</option>
=======
                            <h3 className="font-semibold text-gray-800">Fluxo de Caixa</h3>
                            <select className="text-sm border-gray-200 rounded-lg text-gray-600">
                                <option>Últimos 6 meses</option>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
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
            )}

            {/* Card Modal */}
            {isCardFormOpen && (
<<<<<<< HEAD
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl my-auto">
=======
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
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
<<<<<<< HEAD

            {/* Prolabore Modal */}
            {isProlaboreModalOpen && (
                <ProlaboreModal
                    onClose={() => setIsProlaboreModalOpen(false)}
                />
            )}
=======
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
        </div>
    );
}
