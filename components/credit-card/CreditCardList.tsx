import React from "react";
import { CreditCard } from "@/types";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import CreditCardWidget from "./CreditCardWidget";

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

    if (cards.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>{t('no_cards_found')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map((card) => {
                const invoice = getCardInvoice(card.id);

                return (
                    <CreditCardWidget
                        key={card.id}
                        card={card}
                        currentInvoice={invoice}
                        onEdit={() => onEdit(card)}
                        onDelete={() => handleDelete(card.id, card.name)}
                        onViewInvoice={() => console.log("View invoice", card.id)}
                    />
                );
            })}
        </div>
    );
}
