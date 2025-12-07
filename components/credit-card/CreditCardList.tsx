import React from "react";
import { CreditCard, Transaction } from "@/types";
import { Pencil, Trash2, Calendar, CalendarClock } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreditCardListProps {
    cards: CreditCard[];
    onEdit: (card: CreditCard) => void;
    onDelete: (id: string) => void;
}

export default function CreditCardList({ cards, onEdit, onDelete }: CreditCardListProps) {
    const { t } = useLanguage();
    const { removeCard, transactions } = useFinance();
    const { showToast } = useToast();

    const handleDelete = (id: string, cardName: string) => {
        if (confirm(t('confirm_delete_card', { cardName }))) {
            removeCard(id);
            showToast('success', t('card_deleted_success', { cardName }));
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

                const isHex = card.color.startsWith('#');
                const gradientClass = !isHex ? `bg-gradient-to-br ${card.color === 'purple' ? 'from-purple-600 to-purple-800' :
                    card.color === 'orange' ? 'from-orange-500 to-orange-700' :
                        card.color === 'green' ? 'from-green-600 to-green-800' :
                            card.color === 'red' ? 'from-red-600 to-red-800' :
                                card.color === 'pink' ? 'from-pink-600 to-pink-800' :
                                    card.color === 'indigo' ? 'from-indigo-600 to-indigo-800' :
                                        card.color === 'teal' ? 'from-teal-600 to-teal-800' :
                                            card.color === 'cyan' ? 'from-cyan-600 to-cyan-800' :
                                                card.color === 'yellow' ? 'from-yellow-500 to-yellow-700' :
                                                    card.color === 'gray' ? 'from-gray-600 to-gray-800' :
                                                        card.color === 'black' ? 'from-gray-900 to-gray-800' :
                                                            'from-blue-600 to-blue-800'
                    }` : '';

                return (
                    <div
                        key={card.id}
                        className={`relative rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] ${gradientClass}`}
                        style={{ background: isHex ? card.color : undefined }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white blur-3xl" />
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white blur-3xl" />
                        </div>

                        <div className="relative z-10 text-white">
                            <div className="p-6 border-b border-white/10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <Calendar size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(card)}
                                            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full"
                                            title={t('edit')}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(card.id, card.name)}
                                            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full"
                                            title={t('delete')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-bold mb-1">{card.name}</h3>
                                    <span className="font-mono text-lg opacity-80">**** **** **** 1234</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-white/80 mb-1">{t('card_holder')}</p>
                                        <p className="font-medium text-white">Michael Scott</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/80 mb-1">{t('bank')}</p>
                                        <p className="font-medium text-white">{card.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-6 space-y-6 bg-black/10 backdrop-blur-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-white/80 mb-1">{t('current_invoice')}</p>
                                        <p className="text-2xl font-bold text-white">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/80 mb-1">{t('available_limit')}</p>
                                        <p className="font-semibold text-white">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(available)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-white/80">
                                        <span>{t('limit_usage')}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-white/90">
                                        <Calendar size={16} className="text-white/60" />
                                        <span>{t('closes_day')} <strong>{card.closingDay}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/90">
                                        <CalendarClock size={16} className="text-white/60" />
                                        <span>{t('due_day')} <strong>{card.dueDay}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
