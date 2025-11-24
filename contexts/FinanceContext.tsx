"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, CreditCard } from '@/types';
import { mockTransactions, mockCards } from '@/lib/mock-data';

interface FinanceContextType {
    transactions: Transaction[];
    cards: CreditCard[];
    addTransaction: (transaction: Transaction) => void;
    updateTransaction: (transaction: Transaction) => void;
    removeTransaction: (id: string) => void;
    addCard: (card: CreditCard) => void;
    removeCard: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [cards, setCards] = useState<CreditCard[]>(mockCards);

    const addTransaction = (transaction: Transaction) => {
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
        } else {
            setTransactions((prev) => [transaction, ...prev]);
        }
    };

    const updateTransaction = (updatedTransaction: Transaction) => {
        setTransactions((prev) => prev.map((t) =>
            t.id === updatedTransaction.id ? updatedTransaction : t
        ));
    };

    const removeTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const addCard = (card: CreditCard) => {
        setCards((prev) => [...prev, card]);
    };

    const removeCard = (id: string) => {
        setCards((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                cards,
                addTransaction,
                updateTransaction,
                removeTransaction,
                addCard,
                removeCard,
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
