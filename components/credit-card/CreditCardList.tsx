"use client";

import { CreditCard, Transaction } from "@/types";
import { CreditCard as CardIcon, Calendar, CalendarClock, Trash2 } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

interface CreditCardListProps {
    cards: CreditCard[];
    transactions: Transaction[];
}

export default function CreditCardList({ cards, transactions }: CreditCardListProps) {
    const { removeCard } = useFinance();

    const handleDelete = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este cartão?")) {
            removeCard(id);
        }
    };

    const getCardInvoice = (cardId: string) => {
        return transactions
            .filter(t => t.cardId === cardId && t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => {
                const invoice = getCardInvoice(card.id);
                const available = card.limit - invoice;
                const progress = (invoice / card.limit) * 100;

                const cardColor = card.color === 'purple' ? 'bg-purple-600' :
                    card.color === 'orange' ? 'bg-orange-500' :
                        card.color === 'green' ? 'bg-green-600' :
                            card.color === 'red' ? 'bg-red-600' :
                                card.color === 'black' ? 'bg-gray-900' : 'bg-blue-600';

                return (
                    <div key={card.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative">
                        {/* Delete Button (Visible on Hover) */}
                        <button
                            onClick={() => handleDelete(card.id)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            title="Excluir Cartão"
                        >
                            <Trash2 size={16} />
                        </button>

                        {/* Card Header */}
                        <div className={`${cardColor} p-6 text-white`}>
                            <div className="flex justify-between items-start mb-8">
                                <CardIcon size={32} className="opacity-80" />
                                <span className="font-mono text-lg opacity-80">**** **** **** 1234</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs opacity-80 mb-1">Titular</p>
                                    <p className="font-medium">MICHAEL SCOTT</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs opacity-80 mb-1">Banco</p>
                                    <p className="font-bold text-lg">{card.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fatura Atual</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Limite Disponível</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(available)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Uso do Limite</span>
                                    <span>{progress.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${progress > 90 ? 'bg-red-500' :
                                            progress > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex gap-4 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span>Fecha dia <strong>{card.closingDay}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CalendarClock size={16} className="text-gray-400" />
                                    <span>Vence dia <strong>{card.dueDay}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
