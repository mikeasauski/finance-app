"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import CreditCardList from "@/components/credit-card/CreditCardList";
import { useFinance } from "@/contexts/FinanceContext";
import CreditCardForm from "@/components/forms/CreditCardForm";

export default function CardsPage() {
    const { cards, transactions } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Meus Cartões</h1>
                    <p className="text-gray-500">Gerencie seus limites e faturas</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} />
                    <span>Novo Cartão</span>
                </button>
            </div>

            <CreditCardList cards={cards} transactions={transactions} />

            {/* Add Card Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <CreditCardForm onClose={() => setIsModalOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
