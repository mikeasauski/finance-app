"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction, CreditCard, Account, Goal, ContextType } from '@/types';
import { mockTransactions, mockCards, mockGoals, mockAccounts } from '@/lib/mock-data';
import { BANKS } from '@/lib/banks';

interface FinanceContextType {
    transactions: Transaction[];
    cards: CreditCard[];
    addTransaction: (transaction: Transaction) => void;
    updateTransaction: (transaction: Transaction) => void;
    removeTransaction: (id: string) => void;
    addCard: (card: CreditCard) => void;
    updateCard: (card: CreditCard) => void;
    removeCard: (id: string) => void;
    accounts: Account[];
    addAccount: (account: Account) => void;
    updateAccount: (account: Account) => void;
    removeAccount: (id: string) => void;
    goals: Goal[];
    addGoal: (goal: Goal) => void;
    updateGoal: (goal: Goal) => void;
    removeGoal: (id: string) => void;
    appContext: ContextType;
    setAppContext: (context: ContextType) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Define initial data from mock-data to be used if localStorage is empty
const initialTransactions = mockTransactions;
const initialCards = mockCards;
const initialGoals = mockGoals;
const initialAccounts = mockAccounts;

const COLOR_MAP: Record<string, string> = {
    'purple': '#9333ea',
    'blue': '#2563eb',
    'green': '#16a34a',
    'orange': '#ea580c',
    'red': '#dc2626',
    'black': '#111827',
};

export function FinanceProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [cards, setCards] = useState<CreditCard[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [appContext, setAppContext] = useState<ContextType>('PF');

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedTransactions = localStorage.getItem('finance_transactions');
        const storedCards = localStorage.getItem('finance_cards');
        const storedAccounts = localStorage.getItem('finance_accounts');
        const storedGoals = localStorage.getItem('finance_goals');

        if (storedTransactions) {
            try {
                setTransactions(JSON.parse(storedTransactions));
            } catch (e) {
                console.error("Failed to parse transactions from localStorage", e);
            }
        } else {
            // Load initial mock data if no storage
            setTransactions(initialTransactions);
        }

        if (storedCards) {
            try {
                const parsedCards = JSON.parse(storedCards);
                // Migrate cards without context (backward compatibility) and fix colors
                const migratedCards = parsedCards.map((card: any) => {
                    // Fix legacy colors
                    let color = card.color;

                    // If card has a bankId, try to enforce bank color if current color is invalid/legacy
                    if (card.bankId) {
                        const bank = BANKS.find(b => b.id === card.bankId);
                        if (bank && (!color || !color.startsWith('#'))) {
                            color = bank.color;
                        }
                    }

                    // Fallback for non-bank cards with legacy colors
                    if (color && !color.startsWith('#')) {
                        const lowerColor = color.toLowerCase();
                        if (lowerColor in COLOR_MAP) {
                            color = COLOR_MAP[lowerColor];
                        }
                    }

                    return {
                        ...card,
                        color,
                        context: card.context || 'PF' // Default to PF if no context
                    };
                });
                setCards(migratedCards);
            } catch (e) {
                console.error("Failed to parse cards from localStorage", e);
            }
        } else {
            // Load initial mock data if no storage
            setCards(initialCards);
        }

        if (storedAccounts) {
            try {
                const parsedAccounts = JSON.parse(storedAccounts);
                if (parsedAccounts.length > 0) {
                    setAccounts(parsedAccounts);
                } else {
                    // If stored accounts is empty array, use initial mock data
                    setAccounts(initialAccounts);
                }
            } catch (e) {
                console.error("Failed to parse accounts from localStorage", e);
                setAccounts(initialAccounts);
            }
        } else {
            setAccounts(initialAccounts);
        }

        if (storedGoals) {
            try {
                setGoals(JSON.parse(storedGoals));
            } catch (e) {
                console.error("Failed to parse goals from localStorage", e);
            }
        } else {
            setGoals(initialGoals);
        }
    }, []);

    // Check for due invoices and generate transactions
    useEffect(() => {
        if (cards.length === 0 || transactions.length === 0) return;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        cards.forEach(card => {
            // Calculate invoice amount for the current month
            // Logic: Sum expenses from previous closing date to current closing date
            // For simplicity in this prototype, we'll sum all unpaid expenses for this card
            // In a real app, we'd need precise date window filtering

            // Check if invoice transaction already exists for this month
            const invoiceId = `invoice-${card.id}-${currentMonth}-${currentYear}`;
            const exists = transactions.some(t => t.id === invoiceId);

            if (!exists && card.dueDay <= today.getDate()) {
                const invoiceAmount = transactions
                    .filter(t => t.cardId === card.id && t.type === 'expense' && !t.isPaid)
                    .reduce((acc, curr) => acc + curr.amount, 0);

                if (invoiceAmount > 0) {
                    const invoiceTransaction: Transaction = {
                        id: invoiceId,
                        description: `Fatura ${card.name}`,
                        amount: invoiceAmount,
                        type: 'expense',
                        subType: 'daily',
                        category: 'Cartão de Crédito',
                        date: new Date(currentYear, currentMonth, card.dueDay).toISOString(),
                        paymentMethod: 'debit', // Assumes payment via debit/account
                        isPaid: false, // User needs to mark as paid manually or we automate it
                        status: 'pending',
                        context: card.context,
                        brandId: card.bankId // Use bank logo
                    };

                    // We don't call setTransactions here directly to avoid infinite loops or strict mode issues
                    // In a real app, this would be a backend job or a more controlled effect
                    // For now, we'll skip auto-creation to avoid "magic" behavior that confuses the user
                    // and instead let the user "Pay Invoice" explicitly.
                }
            }
        });
    }, [cards, transactions]);

    // Auto-pay logic for Subscriptions
    // Auto-pay logic for Subscriptions
    useEffect(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const currentDay = today.getDate();

        // Find subscriptions that are due today or past due in this month but not yet generated
        // We look for transactions with subType 'subscription' that are the "Template" or "Definition"
        // Actually, the current model creates 24 months of future transactions for 'fixed' recurrence,
        // but for 'subscription' type, we might want to generate them on the fly or check if the pre-generated one needs status update.

        // Wait, the 'subscription' logic in addTransaction (lines 292+) ALREADY generates future transactions?
        // Let's check: 
        // if (transaction.subType === 'fixed' || transaction.subType === 'subscription' || transaction.recurrence)
        // Yes, it generates future transactions.

        // So, "Auto-Pay" for subscription means:
        // Find the transaction for THIS month that is currently 'pending' (if generated as pending)
        // OR if we want to generate it only on the due date.

        // Current implementation generates them all as 'pending' (except the first one if paid).
        // So we just need to find the pending subscription transaction for today and mark it as paid/active?
        // OR, if the user wants "Assinatura Recorrente" to NOT consume limit, we probably didn't generate them yet?

        // Let's look at addTransaction again.
        // It generates 12/24 months.
        // If subType is 'subscription', we want them to NOT consume limit.
        // The limit check logic (lines 232+) already excludes future subscriptions.

        // So, the "Auto-Pay" requirement is likely:
        // "On the due day, ensure the transaction exists and is effectively 'charged' to the card"
        // If they are already generated as "Pending", maybe we just need to alert the user?
        // Or maybe the requirement is to "Pay" them (change status to paid)?

        // "Implement auto-pay logic for Credit Card subscriptions on due date"
        // "Automatically 'pay' it (generate the expense on the card)."

        // If they are already generated, they are already "expenses on the card".
        // Maybe the goal is to change status from 'pending' (planned) to 'paid' (confirmed)?
        // Let's assume we want to flip the status to 'paid' (or 'confirmed') when the date arrives.

        const transactionsToUpdate = transactions.filter(t => {
            if (t.subType !== 'subscription' || t.isPaid || t.status === 'paid') return false;

            const tDate = new Date(t.date);
            // Check if it's due today or in the past (but same month)
            return tDate.getDate() <= currentDay &&
                tDate.getMonth() === currentMonth &&
                tDate.getFullYear() === currentYear;
        });

        if (transactionsToUpdate.length > 0) {
            const updatedTransactions = transactions.map(t => {
                const shouldUpdate = transactionsToUpdate.some(up => up.id === t.id);
                if (shouldUpdate) {
                    // For Credit Card, "Paid" means the purchase happened, but the debt is NOT settled (isPaid: false).
                    // For Debit/Account, "Paid" means money left the account (isPaid: true).
                    const isCredit = t.paymentMethod === 'credit';
                    return {
                        ...t,
                        status: 'paid' as const,
                        isPaid: !isCredit // If credit, remains false (unpaid debt). If debit, becomes true (paid).
                    };
                }
                return t;
            });
            setTransactions(updatedTransactions);
        }
    }, [transactions]);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('finance_cards', JSON.stringify(cards));
    }, [cards]);

    useEffect(() => {
        localStorage.setItem('finance_accounts', JSON.stringify(accounts));
    }, [accounts]);

    useEffect(() => {
        localStorage.setItem('finance_goals', JSON.stringify(goals));
    }, [goals]);

    const checkTransactionLimit = (transaction: Transaction, oldTransactionId: string | undefined = undefined) => {
        // 1. Check Account Balance for Debit/Transfer/Pix
        if (transaction.paymentMethod !== 'credit' && transaction.accountId) {
            const account = accounts.find(a => a.id === transaction.accountId);
            if (account) {
                // For expense, check if balance >= amount
                // If updating, we need to add back the old amount to the balance before checking?
                // Actually, the balance in state ALREADY reflects the old transaction if it was paid.
                // This is tricky for updates.
                // Simplified approach: If it's an update, we assume the user knows what they are doing for DEBIT, 
                // or we'd need to simulate the reversal.
                // Let's focus on CREDIT LIMIT which is the user's complaint.

                // If it's an update and the old transaction was paid, its effect on balance is already reverted
                // by updateTransaction. So we can check against current balance.
                // If it's a new transaction, or an update where the old one wasn't paid, we check directly.
                if (transaction.type === 'expense' && account.balance < transaction.amount) {
                    throw new Error(`Saldo insuficiente na conta ${account.name}. Saldo: R$ ${account.balance.toFixed(2)}, Valor: R$ ${transaction.amount.toFixed(2)}`);
                }
            }
        }

        // 2. Check Credit Limit for Credit Card
        if (transaction.paymentMethod === 'credit' && transaction.cardId) {
            const card = cards.find(c => c.id === transaction.cardId);
            if (card) {
                // Calculate used limit
                // We need to sum all UNPAID expenses on this card
                // BUT for 'subscription', we only count the CURRENT month (or past unpaid), not future ones.
                // Actually, the simplest way is to check the "Available Limit" logic.
                // Available Limit = Limit - (Sum of all unpaid expenses that affect limit)

                // Which transactions affect limit?
                // - Installments: Full total amount reduces limit immediately (usually). 
                //   Wait, in this app, we generate individual transactions for installments.
                //   So we sum all unpaid installment transactions.
                // - Fixed/Daily: Sum all unpaid.
                // - Subscription: Only current/past unpaid. Future ones do NOT consume limit.

                const today = new Date();
                const usedLimit = transactions
                    .filter(t => t.cardId === card.id && t.type === 'expense' && !t.isPaid && t.id !== oldTransactionId) // Exclude self if updating
                    .reduce((acc, t) => {
                        // Exclude future subscriptions from limit calculation
                        if (t.subType === 'subscription') {
                            const tDate = new Date(t.date);
                            // If it's in a future month, ignore it
                            if (tDate > today && tDate.getMonth() !== today.getMonth()) {
                                return acc;
                            }
                        }
                        return acc + t.amount;
                    }, 0);

                const available = card.limit - usedLimit;
                if (available < transaction.amount) {
                    throw new Error(`Limite insuficiente no cartão ${card.name}. Disponível: R$ ${available.toFixed(2)}, Valor: R$ ${transaction.amount.toFixed(2)}`);
                }
            }
        }
    };

    const updateAccountBalance = (accountId: string, amount: number, type: 'income' | 'expense') => {
        setAccounts(prev => prev.map(acc => {
            if (acc.id === accountId) {
                const balanceChange = type === 'income' ? amount : -amount;
                return { ...acc, balance: acc.balance + balanceChange };
            }
            return acc;
        }));
    };

    const addTransaction = (transaction: Transaction) => {
        try {
            // Check limits before adding
            // If status is 'pending', we might skip balance check for Debit, 
            // but for Credit, it still consumes limit if it's a purchase?
            // User said "Lançar despesas fixas e futuras... e se sim utilizar ou o dinheiro em conta... ou cartao".
            // If pending, it's a "Bill to Pay". It doesn't consume account balance yet.
            // Does it consume Credit Limit? Usually yes if it's a credit purchase.
            // But if it's "Pending" on Credit Card, it means "I will swipe the card later"? Or "I swiped but it's pending"?
            // Let's assume Pending = Not yet deducted from Account / Not yet charged to Card (Plan).
            // So we SKIP limit check if pending.

            if (transaction.status === 'paid') {
                checkTransactionLimit(transaction);
            }
        } catch (e: any) {
            alert(e.message);
            return; // Stop addition
        }

        if (transaction.installments && transaction.installments.total > 1) {
            const newTransactions: Transaction[] = [];
            const installmentAmount = transaction.amount / transaction.installments.total;
            const baseDate = new Date(transaction.date);

            for (let i = 0; i < transaction.installments.total; i++) {
                const date = new Date(baseDate);
                date.setMonth(baseDate.getMonth() + i);

                newTransactions.push({
                    ...transaction,
                    id: crypto.randomUUID(),
                    description: `${transaction.description} (${i + 1}/${transaction.installments.total})`,
                    amount: installmentAmount,
                    date: date.toISOString(),
                    installments: {
                        current: i + 1,
                        total: transaction.installments.total
                    }
                });
            }
            setTransactions((prev) => [...newTransactions, ...prev]);
        } else if (transaction.subType === 'fixed' || transaction.subType === 'subscription' || transaction.recurrence) {
            const newTransactions: Transaction[] = [];
            const baseDate = new Date(transaction.date);
            const targetDay = transaction.recurrence?.day || baseDate.getDate();

            // Generate for next 24 months (2 years)
            const monthsToGenerate = transaction.recurrence?.infinite ? 24 : 12;

            for (let i = 0; i < monthsToGenerate; i++) {
                let date = new Date(baseDate);
                date.setMonth(baseDate.getMonth() + i);

                // Adjust day if it exceeds month length
                const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                const purchaseDay = Math.min(targetDay, daysInMonth);
                date.setDate(purchaseDay);

                // Smart Dating for Credit Cards
                if (transaction.paymentMethod === 'credit' && transaction.cardId) {
                    const card = cards.find(c => c.id === transaction.cardId);

                    if (card) {
                        const closingDay = Number(card.closingDay);
                        const dueDay = Number(card.dueDay);

                        if (purchaseDay >= closingDay) {
                            // Move to next month's due date
                            date.setMonth(date.getMonth() + 1);
                        }

                        // Set to Due Day
                        const targetMonthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                        date.setDate(Math.min(dueDay, targetMonthDays));
                    }
                }

                newTransactions.push({
                    ...transaction,
                    id: crypto.randomUUID(),
                    date: date.toISOString(),
                    isPaid: i === 0 ? transaction.isPaid : false,
                });
            }
            setTransactions((prev) => [...newTransactions, ...prev]);
        } else {
            setTransactions((prev) => [transaction, ...prev]);
        }

        // Update account balance if transaction is paid via account
        if (transaction.accountId && transaction.isPaid) {
            updateAccountBalance(transaction.accountId, transaction.amount, transaction.type);
        }

        // Update Goal Amount if linked
        if (transaction.goalId) {
            setGoals(prev => prev.map(goal => {
                if (goal.id === transaction.goalId) {
                    return { ...goal, currentAmount: goal.currentAmount + transaction.amount };
                }
                return goal;
            }));
        }
    };

    const updateTransaction = (updatedTransaction: Transaction) => {
        try {
            checkTransactionLimit(updatedTransaction, updatedTransaction.id);
        } catch (e: any) {
            alert(e.message);
            return;
        }

        const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);

        if (oldTransaction) {
            // Revert old transaction effect if it was paid via account
            if (oldTransaction.accountId && oldTransaction.isPaid) {
                const revertType = oldTransaction.type === 'income' ? 'expense' : 'income';
                updateAccountBalance(oldTransaction.accountId, oldTransaction.amount, revertType);
            }

            // Revert old goal amount if linked
            if (oldTransaction.goalId) {
                setGoals(prev => prev.map(goal => {
                    if (goal.id === oldTransaction.goalId) {
                        return { ...goal, currentAmount: goal.currentAmount - oldTransaction.amount };
                    }
                    return goal;
                }));
            }
        }

        // Apply new transaction effect if it is paid via account
        if (updatedTransaction.accountId && updatedTransaction.isPaid) {
            updateAccountBalance(updatedTransaction.accountId, updatedTransaction.amount, updatedTransaction.type);
        }

        // Apply new goal amount if linked
        if (updatedTransaction.goalId) {
            setGoals(prev => prev.map(goal => {
                if (goal.id === updatedTransaction.goalId) {
                    return { ...goal, currentAmount: goal.currentAmount + updatedTransaction.amount };
                }
                return goal;
            }));
        }

        setTransactions((prev) => prev.map((t) =>
            t.id === updatedTransaction.id ? updatedTransaction : t
        ));
    };

    const removeTransaction = (id: string) => {
        const transaction = transactions.find(t => t.id === id);

        if (transaction) {
            // Revert Account Balance if paid
            if (transaction.accountId && transaction.isPaid) {
                const revertType = transaction.type === 'income' ? 'expense' : 'income';
                updateAccountBalance(transaction.accountId, transaction.amount, revertType);
            }

            // Revert Goal Amount if linked
            if (transaction.goalId) {
                setGoals(prev => prev.map(goal => {
                    if (goal.id === transaction.goalId) {
                        return { ...goal, currentAmount: goal.currentAmount - transaction.amount };
                    }
                    return goal;
                }));
            }
        }

        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };



    const addCard = (card: CreditCard) => {
        setCards((prev) => [...prev, card]);
    };

    const updateCard = (updatedCard: CreditCard) => {
        setCards((prev) => prev.map((c) =>
            c.id === updatedCard.id ? updatedCard : c
        ));
    };

    const removeCard = (id: string) => {
        setCards((prev) => prev.filter((c) => c.id !== id));
    };

    const addAccount = (account: Account) => {
        setAccounts((prev) => [...prev, account]);
    };

    const updateAccount = (updatedAccount: Account) => {
        setAccounts((prev) => prev.map((a) =>
            a.id === updatedAccount.id ? updatedAccount : a
        ));
    };

    const removeAccount = (id: string) => {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
    };

    const addGoal = (goal: Goal) => {
        setGoals((prev) => [...prev, goal]);
    };

    const updateGoal = (updatedGoal: Goal) => {
        setGoals((prev) => prev.map((g) =>
            g.id === updatedGoal.id ? updatedGoal : g
        ));
    };

    const removeGoal = (id: string) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
    };

    // Expose for debugging
    useEffect(() => {
        (window as any).finance = {
            addTransaction,
            cards,
            transactions
        };
    }, [addTransaction, cards, transactions]);

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                cards,
                addTransaction,
                updateTransaction,
                removeTransaction,
                addCard,
                updateCard,
                removeCard,
                accounts,
                addAccount,
                updateAccount,
                removeAccount,
                goals,
                addGoal,
                updateGoal,
                removeGoal,
                appContext,
                setAppContext,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
