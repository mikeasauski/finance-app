"use client";

import React, { useState, useMemo } from "react";
import { X, Calendar, ArrowRight, TrendingUp, CreditCard as CreditCardIcon } from "lucide-react";
import { Transaction, CreditCard } from "@/types";
import { format, addMonths, startOfMonth, endOfMonth, isSameMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface InvoiceViewProps {
    card: CreditCard;
    transactions: Transaction[];
    onClose: () => void;
}

export default function InvoiceView({ card, transactions, onClose }: InvoiceViewProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Filter transactions for this card
    const cardTransactions = useMemo(() => {
        return transactions.filter(t => t.cardId === card.id && t.type === 'expense');
    }, [transactions, card.id]);

    // Calculate invoice period based on closing day
    const getInvoicePeriod = (date: Date) => {
        const closingDay = Number(card.closingDay);
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        // Invoice Due Date: date (e.g., Nov 20)
        // Closing Date: card.closingDay (e.g., 10)

        // If Closing Day (10) < Due Day (20):
        // The invoice covers purchases from [PrevMonth 10] to [CurrMonth 09].
        // Example: Due Nov 20. Closed Nov 10.
        // Purchases from Oct 10 to Nov 09 go to Nov 20 invoice.
        // Purchases on Nov 10 go to Dec 20 invoice.

        // If Closing Day (25) > Due Day (05):
        // Example: Due Nov 05. Closed Oct 25.
        // Purchases from Sep 25 to Oct 24 go to Nov 05 invoice.

        let start: Date;
        let end: Date;

        if (closingDay < card.dueDay) {
            // Standard case: Closes before due date in same month
            start = new Date(currentYear, currentMonth - 1, closingDay);
            end = new Date(currentYear, currentMonth, closingDay - 1, 23, 59, 59);
        } else {
            // "Best Buy" case: Closes in previous month relative to due date
            // Actually, if Due is Nov 05 and Closing is Oct 25.
            // The "Month" of the invoice is usually named after the Due Date.
            // So for "Nov Invoice", start is Sep 25, end is Oct 24.
            start = new Date(currentYear, currentMonth - 2, closingDay);
            end = new Date(currentYear, currentMonth - 1, closingDay - 1, 23, 59, 59);
        }

        return { start, end };
    };

    // Filter transactions by invoice period
    const currentInvoiceTransactions = useMemo(() => {
        const { start, end } = getInvoicePeriod(selectedDate);

        return cardTransactions.filter(t => {
            const tDate = parseISO(t.date);

            // Check if date is within range [start, end]
            // We use simple comparison
            return tDate >= start && tDate <= end;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [cardTransactions, selectedDate, card.closingDay, card.dueDay]);

    const totalAmount = currentInvoiceTransactions.reduce((acc, t) => acc + t.amount, 0);

    const handlePrevMonth = () => setSelectedDate(prev => addMonths(prev, -1));
    const handleNextMonth = () => setSelectedDate(prev => addMonths(prev, 1));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: card.color }}>
                            <CreditCardIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{card.name}</h2>
                            <p className="text-sm text-gray-500">Fatura de Cartão de Crédito</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Month Navigation */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ArrowRight size={20} className="rotate-180" />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Vencimento em</span>
                        <span className="text-lg font-bold text-gray-900 capitalize">
                            {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                        </span>
                        <span className="text-xs text-gray-400">Dia {card.dueDay}</span>
                    </div>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* Summary */}
                <div className="p-6 grid grid-cols-2 gap-4 bg-blue-50/30">
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total da Fatura</p>
                        <p className="text-2xl font-bold text-gray-900">
                            R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Limite Disponível (Projeção)</p>
                        <p className="text-2xl font-bold text-green-600">
                            R$ {(card.limit - totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Considerando pagamentos desta fatura</p>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600" />
                        Lançamentos
                    </h3>

                    {currentInvoiceTransactions.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>Nenhum lançamento para este período.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentInvoiceTransactions.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                            {t.description.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{t.description}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{format(parseISO(t.date), 'dd/MM')}</span>
                                                <span>•</span>
                                                <span>{t.category}</span>
                                                {t.installments && (
                                                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">
                                                        {t.installments.current}/{t.installments.total}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
