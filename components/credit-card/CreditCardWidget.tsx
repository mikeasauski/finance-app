"use client";

import React from "react";
import { CreditCard as CardIcon, MoreVertical } from "lucide-react";
import { CreditCard } from "@/types";

interface CreditCardWidgetProps {
    card: CreditCard;
    currentInvoice: number;
}

export default function CreditCardWidget({ card, currentInvoice }: CreditCardWidgetProps) {
    const availableLimit = card.limit - currentInvoice;
    const progress = (currentInvoice / card.limit) * 100;

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <CardIcon size={24} className="text-white" />
                </div>
                <button className="text-gray-400 hover:text-white">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="mb-6">
                <h4 className="text-gray-400 text-sm mb-1">{card.name}</h4>
                <p className="text-2xl font-bold tracking-wider">**** **** **** 1234</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fatura Atual</span>
                    <span className="font-semibold">R$ {currentInvoice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Disponível: R$ {availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>Limite: R$ {card.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between text-sm">
                <div>
                    <p className="text-gray-500 text-xs">Fechamento</p>
                    <p className="font-medium">Dia {card.closingDay}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-xs">Vencimento</p>
                    <p className="font-medium">Dia {card.dueDay}</p>
                </div>
            </div>
        </div>
    );
}
