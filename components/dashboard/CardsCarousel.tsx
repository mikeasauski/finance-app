"use client";

import React from "react";
import { CreditCard, Transaction } from "@/types";
import CreditCardWidget from "../credit-card/CreditCardWidget";
import { Plus } from "lucide-react";

interface CardsCarouselProps {
    cards: CreditCard[];
    transactions: Transaction[];
    onAddCard: () => void;
    onEditCard?: (card: CreditCard) => void;
    onDeleteCard?: (cardId: string) => void;
    onViewInvoice?: (card: CreditCard) => void;
}

import { useLanguage } from "@/contexts/LanguageContext";

export default function CardsCarousel({
    cards,
    transactions,
    onAddCard,
    onEditCard,
    onDeleteCard,
    onViewInvoice
}: CardsCarouselProps) {
    const { t } = useLanguage();

    const getCardInvoice = (cardId: string, context: string) => {
        const today = new Date();
        return transactions
            .filter(t => t.cardId === cardId && t.type === 'expense' && t.context === context && !t.isPaid)
            .reduce((acc, t) => {
                // Exclude future subscriptions from invoice calculation
                if (t.subType === 'subscription') {
                    const tDate = new Date(t.date);
                    // If it's in a future month, ignore it
                    if (tDate > today && tDate.getMonth() !== today.getMonth()) {
                        return acc;
                    }
                }
                return acc + t.amount;
            }, 0);
    };

    return (
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
                {cards.map((card) => (
                    <div key={card.id} className="w-[300px] md:w-[340px]">
                        <CreditCardWidget
                            card={card}
                            currentInvoice={getCardInvoice(card.id, card.context)}
                            onEdit={() => onEditCard?.(card)}
                            onDelete={() => onDeleteCard?.(card.id)}
                            onViewInvoice={() => onViewInvoice?.(card)}
                        />
                    </div>
                ))}

                {/* Add Card Button (Carousel Item) */}
                <button
                    onClick={onAddCard}
                    className="w-[100px] md:w-[120px] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="text-sm font-medium">{t('new')}</span>                </button>
            </div>
        </div>
    );
}
